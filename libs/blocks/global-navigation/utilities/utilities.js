import {
  getConfig, getMetadata, loadStyle, loadLana, decorateLinks, localizeLink,
} from '../../../utils/utils.js';
import { getFederatedContentRoot, getFederatedUrl } from '../../../utils/federated.js';
import { processTrackingLabels } from '../../../martech/attributes.js';
import { replaceText } from '../../../features/placeholders.js';

loadLana();

const FEDERAL_PATH_KEY = 'federal';

export const selectors = {
  globalNav: '.global-navigation',
  curtain: '.feds-curtain',
  navLink: '.feds-navLink',
  overflowingTopNav: '.feds-topnav--overflowing',
  navItem: '.feds-navItem',
  activeNavItem: '.feds-navItem--active',
  deferredActiveNavItem: '.feds-navItem--activeDeferred',
  activeDropdown: '.feds-dropdown--active',
  menuSection: '.feds-menu-section',
  menuColumn: '.feds-menu-column',
  gnavPromo: '.gnav-promo',
  columnBreak: '.column-break',
};

export const icons = {
  brand: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 360 87"><defs><style>.cls-1{fill: #eb1000;}</style></defs><path class="cls-1" d="M0,85.75L34.93,2.48h24.48l34.67,83.27h-25.97l-21.87-55.31-14.42,36.29h17.15l6.83,19.02H0ZM126.13,87c-19.51,0-36.04-11.06-36.04-33.06s16.03-34.18,32.69-34.18c2.61,0,5.22.25,7.95.87V0h21.62v82.03c-4.97,2.24-15.53,4.97-26.22,4.97ZM125.64,69.1c1.86,0,3.61-.25,5.1-.75v-30.2c-1.49-.62-3.23-.99-5.22-.99-7.21,0-13.8,5.34-13.8,16.4s6.71,15.54,13.92,15.54ZM190.87,86.87c-18.14,0-33.31-12.18-33.31-33.56s15.16-33.56,33.31-33.56,33.43,12.18,33.43,33.56-15.28,33.56-33.43,33.56ZM190.87,68.85c6.34,0,11.93-4.97,11.93-15.53s-5.59-15.54-11.93-15.54-11.8,4.97-11.8,15.54,5.47,15.53,11.8,15.53ZM255.37,87c-8.45,0-19.14-1.74-25.85-4.85V0h21.63v20.51c2.74-.5,5.47-.87,8.08-.87,17.03,0,32.69,11.18,32.69,32.81,0,22.87-16.78,34.55-36.54,34.55ZM251.14,38.28v30.08c1.37.5,2.98.75,4.85.75,7.33,0,14.29-5.22,14.29-16.41,0-10.44-6.71-15.41-13.92-15.41-1.99,0-3.6.37-5.22.99ZM296.86,53.19c0-20.76,14.54-33.43,31.94-33.43,16.28,0,31.19,10.44,31.19,31.44,0,2.86-.12,5.59-.5,8.33h-40.64c2.36,7.33,8.83,10.81,16.91,10.81,6.59,0,12.68-1.62,19.51-4.6v16.53c-6.34,3.23-13.92,4.6-21.75,4.6-20.63,0-36.66-12.43-36.66-33.68ZM318.61,45.98h21.13c-1.12-7.09-5.84-9.94-10.69-9.94s-8.83,2.98-10.44,9.94Z"/></svg>',
  company: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133.5 118.1"><defs><style>.cls-1 {fill: #eb1000;}</style></defs><g><g><polygon class="cls-1" points="84.1 0 133.5 0 133.5 118.1 84.1 0"/><polygon class="cls-1" points="49.4 0 0 0 0 118.1 49.4 0"/><polygon class="cls-1" points="66.7 43.5 98.2 118.1 77.6 118.1 68.2 94.4 45.2 94.4 66.7 43.5"/></g></g></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path></svg>',
  home: '<svg xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 18 18" width="25"><path fill="#6E6E6E" d="M17.666,10.125,9.375,1.834a.53151.53151,0,0,0-.75,0L.334,10.125a.53051.53051,0,0,0,0,.75l.979.9785A.5.5,0,0,0,1.6665,12H2v4.5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5V12h.3335a.5.5,0,0,0,.3535-.1465l.979-.9785A.53051.53051,0,0,0,17.666,10.125Z"/></svg>',
};

export const darkIcons = {
  ...icons,
  brand: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 360 87"><defs><style>.cls-1{fill: #ffffff;}</style></defs><path class="cls-1" d="M0,85.75L34.93,2.48h24.48l34.67,83.27h-25.97l-21.87-55.31-14.42,36.29h17.15l6.83,19.02H0ZM126.13,87c-19.51,0-36.04-11.06-36.04-33.06s16.03-34.18,32.69-34.18c2.61,0,5.22.25,7.95.87V0h21.62v82.03c-4.97,2.24-15.53,4.97-26.22,4.97ZM125.64,69.1c1.86,0,3.61-.25,5.1-.75v-30.2c-1.49-.62-3.23-.99-5.22-.99-7.21,0-13.8,5.34-13.8,16.4s6.71,15.54,13.92,15.54ZM190.87,86.87c-18.14,0-33.31-12.18-33.31-33.56s15.16-33.56,33.31-33.56,33.43,12.18,33.43,33.56-15.28,33.56-33.43,33.56ZM190.87,68.85c6.34,0,11.93-4.97,11.93-15.53s-5.59-15.54-11.93-15.54-11.8,4.97-11.8,15.54,5.47,15.53,11.8,15.53ZM255.37,87c-8.45,0-19.14-1.74-25.85-4.85V0h21.63v20.51c2.74-.5,5.47-.87,8.08-.87,17.03,0,32.69,11.18,32.69,32.81,0,22.87-16.78,34.55-36.54,34.55ZM251.14,38.28v30.08c1.37.5,2.98.75,4.85.75,7.33,0,14.29-5.22,14.29-16.41,0-10.44-6.71-15.41-13.92-15.41-1.99,0-3.6.37-5.22.99ZM296.86,53.19c0-20.76,14.54-33.43,31.94-33.43,16.28,0,31.19,10.44,31.19,31.44,0,2.86-.12,5.59-.5,8.33h-40.64c2.36,7.33,8.83,10.81,16.91,10.81,6.59,0,12.68-1.62,19.51-4.6v16.53c-6.34,3.23-13.92,4.6-21.75,4.6-20.63,0-36.66-12.43-36.66-33.68ZM318.61,45.98h21.13c-1.12-7.09-5.84-9.94-10.69-9.94s-8.83,2.98-10.44,9.94Z"/></svg>',
  company: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 133.5 118.1"><defs><style>.cls-1 {fill: currentColor;}</style></defs><g><g><polygon class="cls-1" points="84.1 0 133.5 0 133.5 118.1 84.1 0"/><polygon class="cls-1" points="49.4 0 0 0 0 118.1 49.4 0"/><polygon class="cls-1" points="66.7 43.5 98.2 118.1 77.6 118.1 68.2 94.4 45.2 94.4 66.7 43.5"/></g></g></svg>',
};

export const lanaLog = ({ message, e = '', tags = 'errorType=default' }) => {
  const url = getMetadata('gnav-source');
  window.lana.log(`${message} | gnav-source: ${url} | href: ${window.location.href} | ${e.reason || e.error || e.message || e}`, {
    clientId: 'feds-milo',
    sampleRate: 1,
    tags,
  });
};

export const logErrorFor = async (fn, message, tags) => {
  try {
    await fn();
  } catch (e) {
    lanaLog({ message, e, tags });
  }
};

export function addMepHighlightAndTargetId(el, source) {
  let { manifestId, targetManifestId } = source.dataset;
  manifestId ??= source?.closest('[data-manifest-id]')?.dataset?.manifestId;
  targetManifestId ??= source?.closest('[data-adobe-target-testid]')?.dataset?.adobeTargetTestid;
  if (manifestId) el.dataset.manifestId = manifestId;
  if (targetManifestId) el.dataset.adobeTargetTestid = targetManifestId;
  return el;
}

export function toFragment(htmlStrings, ...values) {
  const templateStr = htmlStrings.reduce((acc, htmlString, index) => {
    if (values[index] instanceof HTMLElement) {
      return `${acc + htmlString}<elem ref="${index}"></elem>`;
    }
    return acc + htmlString + (values[index] || '');
  }, '');

  const fragment = document.createRange().createContextualFragment(templateStr).children[0];

  Array.prototype.map.call(fragment.querySelectorAll('elem'), (replaceable) => {
    const ref = replaceable.getAttribute('ref');
    replaceable.replaceWith(values[ref]);
  });

  return fragment;
}

const getPath = (urlOrPath = '') => {
  try {
    const url = new URL(urlOrPath);
    return url.pathname;
  } catch (error) {
    return urlOrPath.replace(/^\.\//, '/');
  }
};

export const federatePictureSources = ({ section, forceFederate } = {}) => {
  const selector = forceFederate
    ? '[src], [srcset]'
    : `[src*="/${FEDERAL_PATH_KEY}/"], [srcset*="/${FEDERAL_PATH_KEY}/"]`;
  section?.querySelectorAll(selector)
    .forEach((source) => {
      const type = source.hasAttribute('src') ? 'src' : 'srcset';
      const path = getPath(source.getAttribute(type));
      const [, localeOrKeySegment, keyOrPathSegment] = path.split('/');
      if (forceFederate || [localeOrKeySegment, keyOrPathSegment].includes(FEDERAL_PATH_KEY)) {
        const federalPrefix = path.includes('/federal/') ? '' : '/federal';
        source.setAttribute(type, `${getFederatedContentRoot()}${federalPrefix}${path}`);
      }
    });
};

let fedsPlaceholderConfig;
export const getFedsPlaceholderConfig = ({ useCache = true } = {}) => {
  if (useCache && fedsPlaceholderConfig) return fedsPlaceholderConfig;

  const { locale, placeholders } = getConfig();
  const libOrigin = getFederatedContentRoot();

  fedsPlaceholderConfig = {
    locale: {
      ...locale,
      contentRoot: `${libOrigin}${locale.prefix}/federal/globalnav`,
    },
    placeholders,
  };

  return fedsPlaceholderConfig;
};

export function getAnalyticsValue(str, index) {
  if (typeof str !== 'string' || !str.length) return str;

  let analyticsValue = processTrackingLabels(str, getConfig(), 30);
  analyticsValue = typeof index === 'number' ? `${analyticsValue}-${index}` : analyticsValue;

  return analyticsValue;
}

export function getExperienceName() {
  const experiencePath = getMetadata('gnav-source');
  const explicitExperience = experiencePath?.split('#')[0]?.split('/').pop();
  if (explicitExperience?.length
    && explicitExperience !== 'gnav') return explicitExperience;

  const { imsClientId } = getConfig();
  if (imsClientId?.length) return imsClientId;

  return '';
}

export function rootPath(path) {
  const { miloLibs, codeRoot } = getConfig();
  const url = `${miloLibs || codeRoot}/blocks/global-navigation/${path}`;
  return url;
}

export function loadStyles(url) {
  loadStyle(url, (e) => {
    if (e === 'error') {
      lanaLog({
        message: 'GNAV: Error in loadStyles',
        e: `error loading style: ${url}`,
        tags: 'errorType=info,module=utilities',
      });
    }
  });
}

export function isDarkMode() {
  const { theme } = getConfig();
  return theme === 'dark';
}

// Base styles are shared between top navigation and footer,
// since they can be independent of each other.
// CSS imports were not used due to duplication of file include
export async function loadBaseStyles() {
  if (isDarkMode()) {
    new Promise((resolve) => { loadStyle(rootPath('base.css'), resolve); })
      .then(() => loadStyles(rootPath('dark-nav.css')));
  } else {
    const url = rootPath('base.css');
    await loadStyles(url);
  }
}

export function loadBlock(path) {
  return import(path).then((module) => module.default);
}

let cachedDecorateMenu;
export async function loadDecorateMenu() {
  if (cachedDecorateMenu) return cachedDecorateMenu;

  let resolve;
  cachedDecorateMenu = new Promise((_resolve) => {
    resolve = _resolve;
  });

  const [{ decorateMenu, decorateLinkGroup }] = await Promise.all([
    loadBlock('./menu/menu.js'),
    loadStyles(rootPath('utilities/menu/menu.css')),
  ]);

  resolve({
    decorateMenu,
    decorateLinkGroup,
  });
  return cachedDecorateMenu;
}

export function decorateCta({ elem, type = 'primaryCta', index } = {}) {
  const modifier = type === 'secondaryCta' ? 'secondary' : 'primary';

  const clone = elem.cloneNode(true);
  clone.className = `feds-cta feds-cta--${modifier}`;
  clone.setAttribute('daa-ll', getAnalyticsValue(clone.textContent, index));

  return toFragment`
    <div class="feds-cta-wrapper">
      ${clone}
    </div>`;
}

let curtainElem;
export function setCurtainState(state) {
  if (typeof state !== 'boolean') return;

  curtainElem = curtainElem || document.querySelector(selectors.curtain);
  if (curtainElem) curtainElem.classList.toggle('feds-curtain--open', state);
}

export const isDesktop = window.matchMedia('(min-width: 900px)');
export const isTangentToViewport = window.matchMedia('(min-width: 900px) and (max-width: 1440px)');

export function setActiveDropdown(elem) {
  const activeClass = selectors.activeDropdown.replace('.', '');

  // We always need to reset all active dropdowns at first
  const resetActiveDropdown = () => {
    [...document.querySelectorAll(selectors.activeDropdown)]
      .forEach((activeDropdown) => activeDropdown.classList.remove(activeClass));
  };
  resetActiveDropdown();

  // If no elem is provided, de-activating all dropdowns is enough
  if (!(elem instanceof HTMLElement)) return;

  // Compose an array of parents that could be active dropdowns
  const selectorArr = [selectors.menuSection, selectors.menuColumn, selectors.navItem];

  // Look for the first parent that fits the active dropdown criteria
  selectorArr.some((selector) => {
    const closestSection = elem.closest(selector);

    if (closestSection && closestSection.querySelector('[aria-expanded = "true"]')) {
      closestSection.classList.add(activeClass);
      return true;
    }

    return false;
  });
}

// Disable AED(Active Element Detection)
export const [setDisableAEDState, getDisableAEDState] = (() => {
  let disableAED = false;
  return [
    () => { disableAED = true; },
    () => disableAED,
  ];
})();

export const [hasActiveLink, setActiveLink, isActiveLink, getActiveLink] = (() => {
  let activeLinkFound;
  const { origin, pathname } = window.location;
  const url = `${origin}${pathname}`;

  return [
    () => activeLinkFound,
    (val) => { activeLinkFound = !!val; },
    (el) => (el.href === url || el.href.startsWith(`${url}?`) || el.href.startsWith(`${url}#`)),
    (area) => {
      const isCustomLinks = area.closest('.link-group')?.classList.contains('mobile-only');
      const disableAED = getDisableAEDState() || isCustomLinks;
      if (disableAED || hasActiveLink() || !(area instanceof HTMLElement)) return null;
      const activeLink = [
        ...area.querySelectorAll('a:not([data-modal-hash])'),
      ].find(isActiveLink);

      if (!activeLink) return null;

      setActiveLink(true);
      return activeLink;
    },
  ];
})();

export function closeAllDropdowns({ type } = {}) {
  const selector = type === 'headline'
    ? '.feds-menu-headline[aria-expanded="true"]'
    : `${selectors.globalNav} [aria-expanded='true']`;
  const openElements = document.querySelectorAll(selector);
  if (!openElements) return;
  [...openElements].forEach((el) => {
    if ('fedsPreventautoclose' in el.dataset) return;
    el.setAttribute('aria-expanded', 'false');
  });

  setActiveDropdown();

  if (isDesktop.matches) setCurtainState(false);
}

export function trigger({ element, event, type } = {}) {
  if (event) event.preventDefault();
  const isOpen = element?.getAttribute('aria-expanded') === 'true';
  closeAllDropdowns({ type });
  if (isOpen) return false;
  element.setAttribute('aria-expanded', 'true');
  return true;
}

export const yieldToMain = () => new Promise((resolve) => { setTimeout(resolve, 0); });

export async function fetchAndProcessPlainHtml({ url, shouldDecorateLinks = true } = {}) {
  let path = getFederatedUrl(url);
  const mepGnav = getConfig()?.mep?.inBlock?.['global-navigation'];
  const mepFragment = mepGnav?.fragments?.[path];
  if (mepFragment && mepFragment.action === 'replace') {
    path = mepFragment.content;
  }
  const res = await fetch(path.replace(/(\.html$|$)/, '.plain.html'));
  if (res.status !== 200) {
    lanaLog({
      message: 'Error in fetchAndProcessPlainHtml',
      e: `${res.statusText} url: ${res.url}`,
      tags: 'errorType=info,module=utilities',
    });
    return null;
  }
  const text = await res.text();
  const { body } = new DOMParser().parseFromString(text, 'text/html');
  if (mepFragment?.manifestId) body.dataset.manifestId = mepFragment.manifestId;
  if (mepFragment?.targetManifestId) body.dataset.adobeTargetTestid = mepFragment.targetManifestId;
  const commands = mepGnav?.commands;
  if (commands?.length) {
    const { handleCommands, deleteMarkedEls } = await import('../../../features/personalization/personalization.js');
    handleCommands(commands, body, true, true);
    deleteMarkedEls(body);
  }
  const inlineFrags = [...body.querySelectorAll('a[href*="#_inline"]')];
  if (inlineFrags.length) {
    const { default: loadInlineFrags } = await import('../../fragment/fragment.js');
    const fragPromises = inlineFrags.map((link) => {
      link.href = getFederatedUrl(localizeLink(link.href));
      return loadInlineFrags(link);
    });
    await Promise.all(fragPromises);
  }

  // federatePictureSources should only be called after decorating the links.
  if (shouldDecorateLinks) {
    decorateLinks(body);
    federatePictureSources({ section: body, forceFederate: path.includes('/federal/') });
  }

  const blocks = body.querySelectorAll('.martech-metadata');
  if (blocks.length) {
    import('../../martech-metadata/martech-metadata.js')
      .then(({ default: decorate }) => blocks.forEach((block) => decorate(block)))
      .catch((e) => {
        lanaLog({
          message: 'Error in fetchAndProcessPlainHtml',
          e,
          tags: 'errorType=info,module=utilities',
        });
      });
  }

  body.innerHTML = await replaceText(body.innerHTML, getFedsPlaceholderConfig());
  return body;
}

export const [setUserProfile, getUserProfile] = (() => {
  let profileData;
  let profileResolve;
  let profileTimeout;

  const profilePromise = new Promise((resolve) => {
    profileResolve = resolve;

    profileTimeout = setTimeout(() => {
      profileData = {};
      resolve(profileData);
    }, 5000);
  });

  return [
    (data) => {
      if (data && !profileData) {
        profileData = data;
        clearTimeout(profileTimeout);
        profileResolve(profileData);
      }
    },
    () => profilePromise,
  ];
})();
