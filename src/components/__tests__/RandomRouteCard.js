import React from "react";
import { render } from "enzyme";
import RandomRouteCard from "../RandomRouteCard";

describe("RandomRouteCard", () => {
  it("renders route_name from the climb", () => {
    const mocked = {
      frontmatter: {
        type: { sport: 1 },
        route_name: "Sample Test",
        yds: "5.10a",
      },
      pathTokens: [
        "USA",
        "Oregon",
        "Central Oregon",
        "Smith Rock",
        "Shipwreck Wall - East Face",
        "marooned",
      ],
      fields: {
        slug: "1",
        parentId: "0",
      },
    };
    const wrapper = render(<RandomRouteCard climb={mocked} />);
    const actual = wrapper.find("h2").text();
    const expected = mocked.frontmatter.route_name;
    expect(actual).toBe(expected);
  });
});
