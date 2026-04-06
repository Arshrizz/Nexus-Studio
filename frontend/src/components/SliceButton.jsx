import React from 'react';
import styled from 'styled-components';

const SliceButton = ({ onClick, children = "Hover me", className = "" }) => {
  return (
    <StyledWrapper className={className}>
      <button className="slice" onClick={onClick}>
        <span className="text">{children}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .slice {
    --c1: #000000;
    --c2: #00f2fe; /* Matching Nexus Studio Cyan/Indigo vibe */
    --size-letter: 1.25rem;
    padding: 0.6em 1.5em;
    font-size: var(--size-letter);
    font-family: 'Inter', sans-serif;

    background-color: transparent;
    border: 2px solid var(--c2);
    border-radius: 8px;
    cursor: pointer;

    overflow: hidden;
    position: relative;
    transition: 300ms cubic-bezier(0.83, 0, 0.17, 1);
    display: flex;
    align-items: center;
    justify-content: center;

    & > .text {
      font-weight: 700;
      color: var(--c2);
      position: relative;
      z-index: 1;
      transition: color 700ms cubic-bezier(0.83, 0, 0.17, 1);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .slice::after {
    content: "";

    width: 0;
    height: calc(300% + 1em);

    position: absolute;
    translate: -50% -50%;
    inset: 50%;
    rotate: 30deg;

    background-color: var(--c2);
    transition: 1000ms cubic-bezier(0.83, 0, 0.17, 1);
  }

  .slice:hover {
    & > .text {
      color: var(--c1);
    }
    &::after {
      width: calc(120% + 1em);
    }
  }

  .slice:active {
    scale: 0.96;
    filter: brightness(0.9);
  }`;

export default SliceButton;
