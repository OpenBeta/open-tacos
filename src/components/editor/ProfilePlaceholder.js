import React from "react";
import {
  TextBlock,
  MediaBlock,
  TextRow,
  RectShape,
  RoundShape,
} from "react-placeholder/lib/placeholders";

const ProfilePlaceholder = () => (
  <div className="w-full 2xl:w-1/3 border-gray-300 border rounded-lg shadow-sm bg-white">
    <div className="border-b py-4 px-4 h-14 bg-gray-100 text-base align-middle rounded-t-lg">
      Basic information
    </div>
    <div className="p-4 ">
      <TextBlock rows={5} color="#F5F5F5" />
    </div>
  </div>
);

export default ProfilePlaceholder;
