import React from "react";

const onChangeText =
  (setter: React.Dispatch<React.SetStateAction<string>>) =>
  (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setter(event.target.value);

export default onChangeText;
