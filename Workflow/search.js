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
    const { total, objects } = JSON.parse(fetch(`https://registry.npmjs.org/-/v1/search?text=${args[0]}&size=9&quality=0.65&popularity=0.98&maintenance=0.5`));
    if (total === 0) {
      return Result.error('未找到结果');
    }
    const result = new Result();
    for (const item of objects) {
      const { package: { name, description, version } } = item;
      result.add({
        uid: name,
        title: name,
        subtitle: `${description} 版本:${version}`,
        autocomplete: name,
        arg: `https://www.npmjs.com/package/${name}`,
      });
    }
    return result.toString();
  } catch (e) {
    return Result.error('网络请求失败', e.message);
  }
}
