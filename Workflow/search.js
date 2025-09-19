#! /usr/bin/osascript -l JavaScript

const app = Application.currentApplication();
app.includeStandardAdditions = true;

// 引入 require 方法。
let require;
{
  const requirePath = './lib/require.js';
  const handle = app.openForAccess(requirePath);
  require = eval(app.read(handle))();
  app.closeAccess(requirePath);
}

const { Result } = require('./lib/alfred');
const { fetch } = require('./lib/fetch');

function run(args) {
  try {
    const list = JSON.parse(fetch(`https://www.npmjs.com/search/suggestions?q=${args[0]}`));
    if (Array.isArray(list)) {
      const result = new Result();
      for (const item of list) {
        const { sanitized_name, description, version } = item;
        result.add({
          uid: sanitized_name,
          title: sanitized_name,
          subtitle: `${description} 版本:${version}`,
          autocomplete: sanitized_name,
          arg: `https://www.npmjs.com/package/${sanitized_name}`,
        });
      }
      return result.toString();
    }
  } catch (e) {
    return Result.error('网络请求失败', e.message);
  }
}
