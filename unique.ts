let characters: any = {
  letters: 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(','),
  capitals: 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(','),
  numbers: '1,2,3,4,5,6,7,8,9,0'.split(',')
};

export class Unique {
  private repo: any[] = [];

  private genCode(type: string, length: number) {
    let collection, code, random, index, i;
  
    length = length || 10;
    type = type || 'letters capitals numbers';
  
    collection = type.split(' ').reduce(function (prev, curr) {
      return prev.concat(characters[curr]);
    }, []);
  
    while (true) {
      code = "";
      for (i = 0; i < length; i++) {
        index = Math.floor(Math.random() * collection.length);
        code += collection[index];
      }
  
      if (this.repo.indexOf(code) === -1) {
        this.repo.push(code);
        break;
      }
    }
  
    return code;
  }

  Get(type = 'letters capitals numbers', length = 14) {
    return this.genCode(type, length);
  }
  
  Clear() {
    this.repo = [];
  }

  Extend(name: string, list: string | string[]) {
    if (['letters', 'capitals', 'numbers'].indexOf(name) > 0) console.log(name + ' cannot be overwritten');
    else {
      if (list instanceof Array) {
        characters[name] = list;
      } else if (typeof list === 'string') {
        characters[name] = list.replace(/\s+/g, '').split(',');
      } else {
        console.log('Invalid list provided:', list);
      }
    }
  }
}

let unique = new Unique();

export default unique;