document.addEventListener('DOMContentLoaded', () => {
  // 加载已保存的 API Key
  chrome.storage.sync.get('apiKey', ({ apiKey }) => {
    document.getElementById('apiKey').value = apiKey || '';
  });

  // 保存 API Key
  document.getElementById('saveApiKey').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.sync.set({ apiKey }, () => {
      alert('API Key 已保存');
    });
  });
});
