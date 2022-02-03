export function errorResolver(params: string[] | string | { [key: string]: [] }): string[] {
  if (typeof params === 'string') {
      return [params];
  } else if (params instanceof Array) {
      return params;
  } else if (params instanceof Object) {
      return [].concat(
          ...Object.keys(params).map((p) => {
              return params[p];
          })
      );
  } else {
      return ['Something went wrong.'];
  }
}
