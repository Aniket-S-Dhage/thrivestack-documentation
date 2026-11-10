/*
 * Behaviour for the MCP docs pages (Introduction + Setup):
 *  - copy-to-clipboard buttons
 *  - client tabs (deep-linkable, keyboard accessible)
 *  - click-to-enlarge screenshots
 * Plain ES5-style JS, no dependencies.
 */
(function () {
    'use strict';

    /* ---------- Copy buttons ---------- */

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
            } catch (e) {
                reject(e);
            } finally {
                document.body.removeChild(ta);
            }
        });
    }

    function flashCopied(btn) {
        var original = btn.getAttribute('data-label') || btn.innerHTML;
        btn.setAttribute('data-label', original);
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        btn.classList.add('is-copied');
        clearTimeout(btn._copyTimer);
        btn._copyTimer = setTimeout(function () {
            btn.innerHTML = original;
            btn.classList.remove('is-copied');
        }, 1800);
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('[data-copy], .mcp-code .mcp-btn') : null;
        if (!btn) return;
        var text = btn.getAttribute('data-copy');
        if (text === null) {
            var box = btn.closest('.mcp-code');
            var code = box && box.querySelector('pre code');
            if (!code) return;
            text = code.innerText.replace(/\n$/, '');
        }
        copyText(text).then(function () { flashCopied(btn); }, function () { /* clipboard blocked: leave button as-is */ });
    });

    /* ---------- Tabs ---------- */

    function initTabs(root) {
        var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
        var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
        if (!tabs.length) return;

        function select(index, opts) {
            opts = opts || {};
            tabs.forEach(function (t, i) {
                var on = i === index;
                t.setAttribute('aria-selected', on ? 'true' : 'false');
                t.tabIndex = on ? 0 : -1;
                if (panels[i]) panels[i].hidden = !on;
            });
            if (opts.focus) tabs[index].focus();
            if (opts.updateHash && window.history && history.replaceState) {
                history.replaceState(null, '', '#' + tabs[index].getAttribute('aria-controls'));
            }
        }

        tabs.forEach(function (t, i) {
            t.addEventListener('click', function () { select(i, { updateHash: true }); });
            t.addEventListener('keydown', function (e) {
                var n = tabs.length, next = -1;
                if (e.key === 'ArrowRight') next = (i + 1) % n;
                else if (e.key === 'ArrowLeft') next = (i - 1 + n) % n;
                else if (e.key === 'Home') next = 0;
                else if (e.key === 'End') next = n - 1;
                if (next >= 0) { e.preventDefault(); select(next, { focus: true, updateHash: true }); }
            });
        });

        function fromHash(scroll) {
            var id = (location.hash || '').slice(1);
            if (!id) return false;
            for (var i = 0; i < panels.length; i++) {
                if (panels[i] && panels[i].id === id) {
                    select(i);
                    if (scroll) root.scrollIntoView({ block: 'start' });
                    return true;
                }
            }
            return false;
        }

        window.addEventListener('hashchange', function () { fromHash(true); });
        if (!fromHash(true)) select(0);
    }

    Array.prototype.forEach.call(document.querySelectorAll('.mcp-tabs'), initTabs);

    /* ---------- Lightbox ---------- */

    var box = null, boxImg = null, lastActive = null;

    function ensureLightbox() {
        if (box) return;
        box = document.createElement('div');
        box.className = 'mcp-lightbox';
        box.setAttribute('aria-hidden', 'true');
        box.innerHTML =
            '<div class="mcp-lightbox-backdrop" data-mcp-close></div>' +
            '<div class="mcp-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Image preview">' +
            '<button type="button" class="mcp-lightbox-close" data-mcp-close aria-label="Close preview"><i class="fa-solid fa-xmark"></i></button>' +
            '<img class="mcp-lightbox-media" alt="">' +
            '</div>';
        document.body.appendChild(box);
        boxImg = box.querySelector('img');
    }

    function openLightbox(src, alt) {
        ensureLightbox();
        lastActive = document.activeElement;
        boxImg.src = src;
        boxImg.alt = alt || 'Image preview';
        box.classList.add('is-open');
        box.setAttribute('aria-hidden', 'false');
        document.body.classList.add('mcp-lightbox-open');
        box.querySelector('.mcp-lightbox-close').focus();
    }

    function closeLightbox() {
        if (!box || !box.classList.contains('is-open')) return;
        box.classList.remove('is-open');
        box.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('mcp-lightbox-open');
        boxImg.removeAttribute('src');
        if (lastActive && lastActive.focus) lastActive.focus();
        lastActive = null;
    }

    document.addEventListener('click', function (e) {
        var link = e.target.closest ? e.target.closest('a.mcp-shot-link') : null;
        if (link) {
            var img = link.querySelector('img');
            e.preventDefault();
            openLightbox(link.getAttribute('href'), img && img.alt);
            return;
        }
        if (e.target.closest && e.target.closest('[data-mcp-close]')) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });
})();
