export function range (begin, end, interval = 1) : number[]{
  let ret = [];
  for (let i = begin; i < end; i += interval) {
    ret.push(i)
  }

  return ret;
}

