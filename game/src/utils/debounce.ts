export function debounce(func: { (): void; apply?: any; }, timeout = 300){
  let timer: number | undefined;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(debounce, args); }, timeout);
  };
}