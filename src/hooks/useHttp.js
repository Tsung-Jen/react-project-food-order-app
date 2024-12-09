import { useEffect, useState, useCallback } from "react";

// generally dealing with sending requests
async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json(); // response data object

  if (!response.ok) {
    throw new Error(
      resData.message || "Something went wrong, failed to send request."
    );
  }

  return resData;
}

// additionally dealing with the state
export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData); // response data state
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [error, setError] = useState(); // error state

  function clearData() {
    setData(initialData);
  }

  const sendRequest = useCallback(
    async function sendRequest(data) {
      setIsLoading(true);
      try {
        const resData = await sendHttpRequest(url, { ...config, body: data });
        setData(resData);
      } catch (error) {
        setError(error.message || "Something went wrong!");
      }
      setIsLoading(false);
    },
    [url, config]
  );

  // useEffect runs after the component function rendered
  useEffect(() => {
    // execute the sendRequest() function only if config is true && the method is GET OR config is true && there is no method in config object OR there is no config object
    if ((config && (config.method === "GET" || !config.method)) || !config) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData
  };
}
