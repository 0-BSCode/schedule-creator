import {
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import React from "react";

interface NumberInputProps {
  value: number;
  onChange: (valAsString: string, valAsNumber: number) => void;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  defaultValue = 0,
}) => {
  return (
    <ChakraNumberInput
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </ChakraNumberInput>
  );
};

export default NumberInput;
