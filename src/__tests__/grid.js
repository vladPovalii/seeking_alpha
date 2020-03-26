import React from "react";
import ReactDOM from "react-dom";
import Grid from "../components/Grid";
import {render, act} from '@testing-library/react';

jest.useFakeTimers();

it("it renders Grid without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Grid isRunning={false}/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

it("it renders Grid with given dimensions", () => {
    const size = 100;
    const { container } = render(<Grid size={size} isRunning={false} />);
    expect(container.firstChild.childNodes.length).toBe(size * size);
});

it("it updates Grid with given frequency", () => {
    const delay = 100;
    act (() => {
        render(<Grid isRunning={true} delay={delay}/>);
    });
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), delay);
});
