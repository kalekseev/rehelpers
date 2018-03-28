export default <T>(promise: Promise<T>) => {
  let hasCanceled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then(
      (val: T) => hasCanceled ? reject({isCanceled: true}) : resolve(val),
      error => hasCanceled ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
};
