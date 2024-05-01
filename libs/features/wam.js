let wamInitialized = false;

let wamData = {
  value: null,
  listeners: [],
  setValue: function (value) {
    this.value = value;
    this.notifyListeners();
  },
  notifyListeners: function () {
    this.listeners.forEach((listener) => {
      listener(this.value);
    });
  },
  addListener: function (listener) {
    this.listeners.push(listener);
  },
};

const createAppsList = (appList) => {
  const list = [];
  /** TODO: Optimize This Logic */
  if (appList) {
    const {
      active_sessions,
      installed,
      available_updates,
      available_to_install,
    } = appList;

    [
      active_sessions,
      installed,
      available_updates,
      available_to_install,
    ].forEach((cat, key) => {
      cat.forEach((app) => {
        const application = {
          name: app.display_name,
          code: app.sapcode,
          versions: {
            available: app.version,
            installed: app.all_installed_versions,
          },
          entitlement: {
            mode: app.entitlement_info?.licenseMode,
            status: app.entitlement_info?.status,
          },
          statusCode: key,
          statusText: app.status,
          action: () => {
            if (key === 3) {
              window.CCWamclient.sendCommand({
                sapCode: app.sapcode,
                version: application.versions.available,
                commandPayload: {
                  command: 'install',
                },
              });
            } else if (key === 1) {
              window.CCWamclient.sendCommand({
                sapCode: app.sapcode,
                version: application.versions.available,
                commandPayload: {
                  command: 'launch',
                },
              });
            }
          },
        };
        list.push(application);
      });
    });
  }
  wamData.setValue(list);
};

const getWAM = async (getConfig) => {
  const {
    env: { name },
    imsClientId,
  } = getConfig();
  const token = window?.adobeIMS?.getAccessToken()?.token;
  const initConfigJson = {
    env: name === 'prod' ? name : 'stage',
    clientId: imsClientId,
    userContext: {
      accessToken: token,
    },
    isLoggingEnabled: false,
    callbacks: {
      onSuccessCallback: (res) => {
        wamInitialized = true;
        console.log(
          'Connection with WAM is established in: ',
          res.timeTakenInWAMWF
        );
      },
      onFailureCallback: (err) => {
        console.log(
          `Connection with WAM could not be established, error is: ${JSON.stringify(
            err.error
          )}`
        );
      },
      clientTokenExpiryCheck: () => {
        return true;
      },
      onClientStateCallback: (clientState) => {
        console.log(clientState);
      },
      onMessageCallback: (statusMessage) => {
        const thorProductsList =
          window.CCWamclient.processMessage(statusMessage);
        createAppsList(thorProductsList);
      },
    },
  };
  window?.CCWamclient?.initialize(initConfigJson);
};

const enableWAMButton = () => {
  /** TODO: Optimize This Logic */
  wamData.addListener((appList) => {
    if (appList.length) {
      console.log(appList);
      const wamButtons = document.querySelectorAll('a[href*="wamProduct-"]');
      wamButtons.forEach((button) => {
        const productCode = button.hash.split('-')[1];
        const productDetail = appList.find((app) => app.code === productCode);
        if (productDetail) {
          const { statusCode, statusText } = productDetail;
          if (statusCode === 0) {
            button.classList.add('disabled');
            button.setAttribute('disabled', 'disabled');
            button.textContent = statusText;
          } else {
            button.classList.remove('disabled');
            button.removeAttribute('disabled');
            if (statusCode === 1) {
              button.textContent = 'open';
            } else if (statusCode === 2) {
              button.textContent = 'update';
            } else {
              button.textContent = 'install';
            }
          }
          const buttonAction = (e) => {
            e.preventDefault();
            productDetail.action();
          };
          button.removeEventListener('click', buttonAction);
          button.addEventListener('click', buttonAction);
        }
      });
    }
  });
};

const loadWamConfig = async (getConfig, loadScript) => {
  enableWAMButton();
  var urlString = window.location.href;
  var url = new URL(urlString);
  var searchParams = new URLSearchParams(url.search);
  if (searchParams.has('inMilo')) {
    await loadScript('/libs/tools/wamClient/wamClient.js');
  } else {
    await loadScript(
      'https://stage.adobeccstatic.com/wamclient/0.1/wamclient.js'
    );
  }
  getWAM(getConfig);
};

export default async function initWAM(getConfig, loadIms, loadScript) {
  try {
    await loadIms();
  } catch {
    return;
  }
  if (!window.adobeIMS?.isSignedInUser()) return;
  !wamInitialized && await loadWamConfig(getConfig, loadScript);
}
