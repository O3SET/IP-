document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('settingsButton').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const ip = getIpFromUrl(tab.url);
    if (ip) {
      chrome.storage.sync.get('apiKey', ({ apiKey }) => {
        if (apiKey) {
          const search = `ip="${ip}"`;
          const encodedSearch = btoa(search);
          const url = `https://hunter.qianxin.com/openApi/search?api-key=${apiKey}&search=${encodedSearch}&page=1&page_size=10&is_web=1`;

          fetch(url)
            .then(response => response.json())
            .then(data => {
              displayFirstResult(data);
            })
            .catch(error => {
              document.getElementById('result').textContent = '请求数据出错: ' + error;
            });
        } else {
          document.getElementById('result').textContent = 'API Key 未设置，请在设置选项中设置 API Key。';
        }
      });
    } else {
      document.getElementById('result').textContent = '当前标签页URL中没有找到有效的IP地址。';
    }
  });
});

function getIpFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      return hostname;
    }
  } catch (e) {
    console.error('无效的URL:', e);
  }
  return null;
}

function displayFirstResult(data) {
  if (data && data.data && data.data.arr && data.data.arr.length > 0) {
    let displayText = '';
    for (const result of data.data.arr) {
      if (result.ip && result.domain && result.company && result.number && result.country && result.province && result.city) {
        displayText += `
          <div class="result-item"><span>IP:</span> ${result.ip}</div>
          <div class="result-item"><span>域名:</span> ${result.domain}</div>
          <div class="result-item"><span>公司:</span> ${result.company}</div>
          <div class="result-item"><span>编号:</span> ${result.number}</div>
          <div class="result-item"><span>国家:</span> ${result.country}</div>
          <div class="result-item"><span>省份:</span> ${result.province}</div>
          <div class="result-item"><span>城市:</span> ${result.city}</div>
          <div class="separator"></div>
        `;
        break; // 只显示第一个匹配到的结果
      }
    }
    document.getElementById('result').innerHTML = displayText;
  } else {
    document.getElementById('result').textContent = '没有找到与给定IP地址相关的数据。';
  }
}
