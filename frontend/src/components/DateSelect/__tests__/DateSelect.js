import React from "react";
import { shallow } from "enzyme";
import DateSelect from "../DateSelect";

const defaultProps = {
  label: "I'm a date picker",
  onChange: jest.fn(),
  maxYear: 9999,
};

describe("DateSelect", () => {
  it("renders", () => {
    const comp = shallow(<DateSelect {...defaultProps} />);
    expect(comp).toMatchSnapshot();
  });
});
