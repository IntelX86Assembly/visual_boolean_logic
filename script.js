"use strict";

const CELL_COUNT = 9;
const OPERATIONS = ["AND", "OR", "XOR", "NOR", "NAND", "XNOR"];

const inputAGrid = document.getElementById("input-a");
const inputBGrid = document.getElementById("input-b");
const resultGrid = document.getElementById("result");
const operationLabel = document.getElementById("operation");
const statusLabel = document.getElementById("status");
const nextButton = document.getElementById("next-button");

let inputA = [];
let inputB = [];
let playerResult = [];
let expectedResult = [];
let currentOperation = "AND";
let solved = false;

/**
 * Returns a random Boolean value.
 *
 * @returns {boolean}
 */
function randomBoolean() {
  return Math.random() >= 0.5;
}

/**
 * Creates an array containing nine random Boolean values.
 *
 * @returns {boolean[]}
 */
function createRandomGrid() {
  return Array.from({ length: CELL_COUNT }, randomBoolean);
}

/**
 * Selects a random Boolean operation.
 *
 * @returns {string}
 */
function selectRandomOperation() {
  const index = Math.floor(Math.random() * OPERATIONS.length);
  return OPERATIONS[index];
}

/**
 * Applies the selected operation to two Boolean values.
 *
 * @param {boolean} a
 * @param {boolean} b
 * @param {string} operation
 * @returns {boolean}
 */
function applyOperation(a, b, operation) {
  switch (operation) {
    case "AND":
      return a && b;

    case "OR":
      return a || b;

    case "XOR":
      return a !== b;

    case "NOR":
      return !(a || b);

    case "NAND":
      return !(a && b);

    case "XNOR":
      return a === b;

    default:
      throw new Error(`Unknown Boolean operation: ${operation}`);
  }
}

/**
 * Calculates the expected result for all corresponding cells.
 *
 * @returns {boolean[]}
 */
function calculateExpectedResult() {
  return inputA.map((value, index) => {
    return applyOperation(value, inputB[index], currentOperation);
  });
}

/**
 * Checks whether two Boolean arrays contain identical values.
 *
 * @param {boolean[]} first
 * @param {boolean[]} second
 * @returns {boolean}
 */
function gridsMatch(first, second) {
  return first.every((value, index) => value === second[index]);
}

/**
 * Creates and displays all cells in a grid.
 *
 * @param {HTMLElement} gridElement
 * @param {boolean[]} values
 * @param {boolean} interactive
 */
function renderGrid(gridElement, values, interactive = false) {
  gridElement.replaceChildren();

  values.forEach((isFilled, index) => {
    const cell = document.createElement(
      interactive ? "button" : "div"
    );

    cell.className = "cell";
    cell.setAttribute("role", "gridcell");

    if (isFilled) {
      cell.classList.add("filled");
    }

    if (interactive) {
      cell.type = "button";
      cell.dataset.index = String(index);
      cell.setAttribute(
        "aria-label",
        `Result cell ${index + 1}: ${isFilled ? "filled" : "empty"}`
      );

      cell.addEventListener("click", handleResultCellClick);
    } else {
      cell.setAttribute(
        "aria-label",
        `Cell ${index + 1}: ${isFilled ? "one" : "zero"}`
      );
    }

    gridElement.appendChild(cell);
  });
}

/**
 * Handles interaction with one of the result cells.
 *
 * @param {MouseEvent} event
 */
function handleResultCellClick(event) {
  if (solved) {
    return;
  }

  const clickedCell = event.currentTarget;
  const index = Number(clickedCell.dataset.index);

  playerResult[index] = !playerResult[index];
  renderGrid(resultGrid, playerResult, true);
  checkSolution();

  if (!solved) {
    const updatedCell = resultGrid.children[index];

    if (updatedCell instanceof HTMLElement) {
      updatedCell.focus();
    }
  }
}

/**
 * Displays the solved state once the player's grid is correct.
 */
function checkSolution() {
  if (!gridsMatch(playerResult, expectedResult)) {
    statusLabel.textContent = "Click cells to add or remove circles.";
    statusLabel.classList.remove("solved");
    nextButton.hidden = true;
    return;
  }

  solved = true;
  statusLabel.textContent = "Correct!";
  statusLabel.classList.add("solved");
  nextButton.hidden = false;
  nextButton.focus();
}

/**
 * Starts a new randomized puzzle.
 */
function startGame() {
  inputA = createRandomGrid();
  inputB = createRandomGrid();
  playerResult = Array(CELL_COUNT).fill(false);
  currentOperation = selectRandomOperation();
  expectedResult = calculateExpectedResult();
  solved = false;

  operationLabel.textContent = currentOperation;
  statusLabel.textContent = "Click cells to add or remove circles.";
  statusLabel.classList.remove("solved");
  nextButton.hidden = true;

  renderGrid(inputAGrid, inputA);
  renderGrid(inputBGrid, inputB);
  renderGrid(resultGrid, playerResult, true);
}

nextButton.addEventListener("click", startGame);

startGame();
