//Файл для получения предыдущего значения переменной
import { useEffect } from "react";
import { useRef } from "react";

const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;