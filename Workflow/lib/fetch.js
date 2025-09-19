/**
 * 发送指定网络请求。
 * @param {string} input 要请求的 URL。
 * @returns {Promise<Response>} 请求的响应。
 */
function fetch(input) {
  return app.doShellScript(`curl $'${input.replace(/'/g, "\\'")}' -g`);
}

module.exports = { fetch };
