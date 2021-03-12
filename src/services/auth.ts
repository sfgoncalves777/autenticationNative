interface Response {
  token: string;
  user: {
    name: string;
    email: string;
  }
}

export function signIn(): Promise<Response> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        token: 'a51s5a151sas',
        user: {
          name:'Silvani',
          email: 'silvanibjj@gmail.com',
        }
      });
    }, 200);
  });
}