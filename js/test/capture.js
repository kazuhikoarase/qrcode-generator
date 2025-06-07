const limit = 76;
export const capture = function(name, s) {
  let code = '';
  const println = function(s) { code += s + '\n'; };
  let line = s;
  println('let ' + name + ' = \'\';');
  while (line.length > limit) {
    println(name + ' += \'' + line.substring(0, limit) + '\';');
    line = line.substring(limit);
  }
  if (line.length > 0) {
    println(name + ' += \'' + line + '\';');
  }
  console.log(code);
  return s;
};
