export type RandomStringType = 'letters' | 'capitals' | 'numbers' | 'symbols';

export function randomStr(length = 16, type?: [RandomStringType?, RandomStringType?, RandomStringType?, RandomStringType?]): string {
  let code = '';
  if (!type) type = ['letters'];
  const characters: any = {
    letters: 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(','),
    capitals: 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(','),
    numbers: '1,2,3,4,5,6,7,8,9,0'.split(','),
    symbols: `'"/!@#$%^&*()-_=+|?><~;:[]{}.,`
  };

  let collection: any[] = type.reduce(function (prev, curr: string) {
    return prev.concat(characters[curr]);
  }, []);

  for (let i = 0; i < length; i++) {
    let index = Math.floor(Math.random() * collection.length);
    code += collection[index];
  }

  return code;
}