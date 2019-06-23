export const categoryImage = name => {
  switch (name) {
    case "Charity":
      return require("@src/assets/images/Charity.png");
    case "Saving":
      return require("@src/assets/images/Saving.png");
    case "Housing":
      return require("@src/assets/images/Housing.png");
    case "Utilities":
      return require("@src/assets/images/Utilities.png");
    case "Food":
      return require("@src/assets/images/Food.png");
    case "Clothing":
      return require("@src/assets/images/Clothing.png");
    case "Transportation":
      return require("@src/assets/images/Transportation.png");
    case "Medical/Health":
      return require("@src/assets/images/Health.png");
    case "Insurance":
      return require("@src/assets/images/Insurance.png");
    case "Personal":
      return require("@src/assets/images/Personal.png");
    case "Recreation":
      return require("@src/assets/images/Recreation.png");
    case "Debts":
      return require("@src/assets/images/Debts.png");
  }
};
