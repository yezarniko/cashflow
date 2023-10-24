import React from "react";
import branchSelectorIcon from "@assets/branchSelector.png";

function BranchSelector() {
  return (
    <div className="branches__selector">
      <div className="branches__selector__icon">
        <img src={branchSelectorIcon} />
      </div>
      <div className="branches__selector__text">Main</div>
    </div>
  );
}

export default BranchSelector;
