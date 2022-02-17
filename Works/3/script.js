let tb_key = document.getElementById('key');
let tb_input = document.getElementById('input_text');
let tb_output = document.getElementById('output_text');
let errorBlock = document.getElementById('error');

function error(text){
  errorBlock.classList.toggle('_visible', Boolean(text));
  errorBlock.innerHTML = text;
}
function validation(){
  let word = tb_key.value
  let isValid = true;
  if(word.length > 1){
    for (let i = 0; i < word.length; i++) {
      let count = 0;
      for (let j = 0; j < word.length; j++) {
        if(word[j] == word[i]) count++;
      }
      if(count != 1){
        isValid = false;
        error("<b>Ошибка:</b> Символы в ключе не должны повторяться");
      };
    }
  }else{
    isValid = false;
    error("<b>Ошибка:</b> Ключ должен быть больше одного символа");
  };
  if(isValid) error(false);
  return isValid;
}

function encode(text, key){
  let matrix = [[]];
  const width = key.length;
  const height = Math.ceil(text.length / key.length);
  let y = 0, x = 0;
  for (let i = 0; i < text.length; i++) {
    matrix[y][x] = text[i];
    x++;
    if(x > width-1 && i < text.length-1){
      x = 0; y++;
      matrix[y] = new Array();
    }
  }
  let warr = key.split('').sort();
  let chpos = [];
  for (let i = 0; i < warr.length; i++) {
    let pos = key.indexOf(warr[i]);
    chpos[pos] = i;
  }
  let result = '';
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      result+= matrix[j]?.[chpos.indexOf(i)] || '';
    }
  }
  while(result.indexOf(' ') != -1 ){result = result.replace(' ', '#')}
  delete matrix;
  return result;
}

function decode(text, key){
  let matrix = [[]];
  const width = key.length;
  const height = Math.ceil(text.length / key.length);
  const lats_line =  width - (width * height - text.length);
  for (let i = 0; i < height; i++){
    matrix[i] = i < Math.floor(text.length / width) ? new Array(width) : new Array(lats_line);
  }
  let warr = key.split('').sort();
  let chpos = [];
  for (let i = 0; i < warr.length; i++) {
    let pos = key.indexOf(warr[i]);
    chpos[pos] = i;
  }
  let index = 0;
  for (let i = 0; i < width ; i++) {
    for (let j = 0; j < height; j++) {
      if( j*width + chpos.indexOf(i) < text.length  ){
        matrix[j][chpos.indexOf(i)] = text[index];
        index++;
      }
    }
  }
  let result = '';
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const ch = matrix[i]?.[j];
      if(ch != undefined){
        result+= ch == '_' || ch == '#' || ch == ' ' ? ' ' :  ch;
      }
    }
  }
  delete matrix;
  return result;
}

function btn_encode(){
  if(validation()){
    tb_output.value = encode(tb_input.value, tb_key.value);
  }
}

function btn_decode(){
  if(validation()){
    tb_input.value = decode(tb_output.value, tb_key.value);
  }
}


