import React from "react";
import ReactDOM from "react-dom";
import Grid from "../components/Grid";
import {render, screen, act} from '@testing-library/react';

it("renders Grid without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Grid/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it("renders Grid with given dimensions", () => {
    const size = 100;
    const { container } = render(<Grid size={size} />);
    expect(container.firstChild.childNodes.length).toBe(size * size);
});

if('updated Grid with given frequency', () => {
    const size = 100;
    const { container } = render(<Grid size={size} />);
    expect(container.firstChild.childNodes.length).toBe(size * size);
});