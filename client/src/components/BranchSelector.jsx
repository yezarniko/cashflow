import React from "react";
import branchSelectorIcon from "@assets/branchSelector.png";

function BranchSelector() {
  return (
    <div className="branches__selector items-center">
      <div className="branches__selector__icon">
        <img src={branchSelectorIcon} />
      </div>
      <div className="text-slate-600">Main</div>
    </div>
  );
}

export default BranchSelector;
