(function (window, document) {
  'use strict';

  function queryAll(root, selector) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function numberList(values) {
    return Array.isArray(values) ? values.map(Number).filter(Number.isFinite) : [];
  }

  function normalizeLegacyStringTokens(source) {
    return String(source || '').replace(/'((?:\\.|[^'\\])*)'/g, function (match, value) {
      return JSON.stringify(value
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\'));
    });
  }

  function parsePayload(source) {
    try {
      return JSON.parse(String(source || '{}'));
    } catch (nativeError) {
      return JSON.parse(normalizeLegacyStringTokens(source));
    }
  }

  function formatNumber(value) {
    var number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '-';
  }

  function stats(data) {
    if (!data.length) return null;
    var latest = data[data.length - 1];
    var first = data[0];
    var min = Math.min.apply(Math, data);
    var max = Math.max.apply(Math, data);
    var avg = data.reduce(function (sum, entry) { return sum + entry; }, 0) / data.length;
    var delta = latest - first;
    var trend = Math.abs(delta) < 0.05 ? 'flat' : delta > 0 ? 'up' : 'down';
    return { latest: latest, first: first, min: min, max: max, avg: avg, delta: delta, trend: trend, samples: data.length };
  }

  function sparklinePoints(data, width, height, pad, min, max) {
    var span = max - min || 1;
    return data.map(function (entry, index) {
      var x = data.length === 1 ? width / 2 : pad + index * ((width - pad * 2) / (data.length - 1));
      var y = height - pad - ((entry - min) / span) * (height - pad * 2);
      return [x, y];
    });
  }

  function detailRow(label, value) {
    var row = document.createElement('div');
    var term = document.createElement('dt');
    var definition = document.createElement('dd');
    term.textContent = label;
    definition.textContent = value;
    row.appendChild(term);
    row.appendChild(definition);
    return row;
  }

  function renderSparkline(host, width, height, label, state, points, area, line, data, labels) {
    var namespace = 'http://www.w3.org/2000/svg';
    host.replaceChildren();
    var svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('role', 'img');
    svg.setAttribute('focusable', 'false');
    var title = document.createElementNS(namespace, 'title');
    title.textContent = label + ': aktuell ' + formatNumber(state.latest) + ', Minimum ' + formatNumber(state.min) + ', Maximum ' + formatNumber(state.max);
    var polygon = document.createElementNS(namespace, 'polygon');
    polygon.setAttribute('points', area);
    polygon.setAttribute('class', 'wb-dashboard-sparkline__area');
    var polyline = document.createElementNS(namespace, 'polyline');
    polyline.setAttribute('points', line);
    polyline.setAttribute('class', 'wb-dashboard-sparkline__line');
    svg.appendChild(title);
    svg.appendChild(polygon);
    svg.appendChild(polyline);
    points.forEach(function (coordinates, index) {
      var point = document.createElementNS(namespace, 'circle');
      var pointLabel = Array.isArray(labels) && labels[index] ? String(labels[index]) : 'Messpunkt ' + (index + 1);
      var description = pointLabel + ': ' + formatNumber(data[index]);
      point.setAttribute('cx', coordinates[0].toFixed(1));
      point.setAttribute('cy', coordinates[1].toFixed(1));
      point.setAttribute('r', index === points.length - 1 ? '3.5' : '2.5');
      point.setAttribute('class', 'wb-dashboard-sparkline__point wb-dashboard-sparkline__hit');
      point.setAttribute('tabindex', '0');
      point.setAttribute('role', 'img');
      point.setAttribute('aria-label', description);
      var pointTitle = document.createElementNS(namespace, 'title');
      pointTitle.textContent = description;
      point.appendChild(pointTitle);
      svg.appendChild(point);
    });
    host.appendChild(svg);
  }

  function renderMetric(root, id, series, labels) {
    var node = root.querySelector('#' + id);
    if (!node) return false;
    var card = root.querySelector('[data-wb-metric-card="' + id + '"]') || node.closest('.wb-dashboard-metric-card');
    var data = numberList(series && series.data);
    var value = root.querySelector('[data-wb-dashboard-metric-value="' + id + '"]');
    var trend = root.querySelector('[data-wb-metric-trend="' + id + '"]');
    var meta = root.querySelector('[data-wb-metric-meta="' + id + '"]');
    var details = root.querySelector('[data-wb-metric-details="' + id + '"]');
    var toggle = root.querySelector('[data-wb-metric-toggle="' + id + '"]');
    var label = node.getAttribute('aria-label') || id;

    if (!data.length) {
      node.classList.add('wb-dashboard-sparkline--empty');
      node.textContent = 'Keine Messwerte';
      if (value) value.textContent = '-';
      if (trend) trend.textContent = 'Trend -';
      if (meta) meta.textContent = 'Keine Datenbasis';
      if (details) details.hidden = true;
      if (toggle) toggle.hidden = true;
      return false;
    }

    var state = stats(data);
    var width = 260;
    var height = 86;
    var pad = 7;
    var points = sparklinePoints(data, width, height, pad, state.min, state.max);
    var line = points.map(function (point) { return point[0].toFixed(1) + ',' + point[1].toFixed(1); }).join(' ');
    var area = pad + ',' + (height - pad) + ' ' + line + ' ' + (width - pad) + ',' + (height - pad);
    var firstLabel = Array.isArray(labels) && labels.length ? String(labels[0]) : '';
    var lastLabel = Array.isArray(labels) && labels.length ? String(labels[labels.length - 1]) : '';
    var trendText = state.trend === 'flat' ? 'stabil' : (state.delta > 0 ? '+' : '') + formatNumber(state.delta);

    if (value) value.textContent = formatNumber(state.latest);
    if (trend) {
      trend.textContent = 'Trend ' + trendText;
      trend.dataset.wbMetricTrendDirection = state.trend;
      trend.title = 'Entwicklung seit dem ersten sichtbaren Messpunkt';
    }
    if (meta) meta.textContent = 'Mittel ' + formatNumber(state.avg) + ' \u00b7 Min ' + formatNumber(state.min) + ' \u00b7 Max ' + formatNumber(state.max);
    if (card) {
      card.dataset.wbMetricLatest = String(state.latest);
      card.dataset.wbMetricMin = String(state.min);
      card.dataset.wbMetricMax = String(state.max);
      card.dataset.wbMetricAverage = String(state.avg);
      card.dataset.wbMetricDelta = String(state.delta);
      card.dataset.wbMetricTrend = state.trend;
      card.dataset.wbMetricSamples = String(state.samples);
    }

    node.dataset.wbMetricValues = data.join(',');
    node.dataset.wbMetricLabel = label;
    node.dataset.wbMetricLatest = String(state.latest);
    node.title = label + ': ' + formatNumber(state.latest) + (lastLabel ? ' - ' + lastLabel : '');
    renderSparkline(node, width, height, label, state, points, area, line, data, labels);

    if (details) {
      details.replaceChildren(
        detailRow('Aktuell', formatNumber(state.latest)),
        detailRow('Trend', trendText),
        detailRow('Minimum', formatNumber(state.min)),
        detailRow('Durchschnitt', formatNumber(state.avg)),
        detailRow('Maximum', formatNumber(state.max)),
        detailRow('Messpunkte', state.samples),
        detailRow('Zeitraum', firstLabel && lastLabel ? firstLabel + ' - ' + lastLabel : 'letzte Werte')
      );
    }
    if (toggle) toggle.hidden = false;
    return true;
  }

  function enhance(root) {
    root = root || document;
    queryAll(root, '[data-wb-dashboard-metrics-data]').forEach(function (payload) {
      if (payload.dataset.wbDashboardMetricsReady === 'true') return;
      var data;
      try {
        data = parsePayload(payload.textContent || '{}');
      } catch (error) {
        payload.dataset.wbDashboardMetricsState = 'error';
        payload.removeAttribute('data-wb-dashboard-metrics-ready');
        document.dispatchEvent(new CustomEvent('workbench:dashboard-metrics-error', {
          detail: { payload: payload, error: error }
        }));
        return;
      }
      var rendered = 0;
      Object.keys(data.series || {}).forEach(function (id) {
        if (renderMetric(root, id, data.series[id], data.labels || [])) rendered += 1;
      });
      payload.dataset.wbDashboardMetricsState = rendered ? 'rendered' : 'empty';
      payload.dataset.wbDashboardMetricsRendered = String(rendered);
      payload.dataset.wbDashboardMetricsReady = 'true';
      document.dispatchEvent(new CustomEvent('workbench:dashboard-metrics-ready', {
        detail: { payload: payload, rendered: rendered }
      }));
    });
  }

  function toggleDetails(button) {
    var id = button && button.getAttribute('data-wb-metric-toggle');
    var details = id ? document.querySelector('[data-wb-metric-details="' + id + '"]') : null;
    if (!details) return;
    var expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    details.hidden = expanded;
  }

  window.workbenchDashboardMetrics = { enhance: enhance, parsePayload: parsePayload };
  document.addEventListener('DOMContentLoaded', function () { enhance(document); });
  document.addEventListener('workbench:content-ready', function (event) { enhance(event.detail && event.detail.root ? event.detail.root : document); });
  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest ? event.target.closest('[data-wb-metric-toggle]') : null;
    if (!button) return;
    event.preventDefault();
    toggleDetails(button);
  });
})(window, document);
