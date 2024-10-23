//function to generate a range of numbers.
const range = (start, end) => Array(end - start + 1).fill(start).map((element, index) => element+index);

const charRange = (start, end) => range(start.charCodeAt(0), end.charCodeAt(0)).map(code => String.fromCharCode(code)); //Your range function expects numbers, but your start and end values will be strings (specifically, they will be single characters such as A). Convert your start and end values in your range() call to numbers by using the .charCodeAt() method on them, passing the number 0 as the argument to that method. range() will return an array of numbers, which you need to convert back into characters. Chain the .map() method to your range() call. Pass a callback function that takes code as the parameter and implicitly returns the value of passing code to the String.fromCharCode() method.

window.onload = () => {
  const container = document.getElementById('container');

  //the createLabel function for making the spreadsheet's label
  const createLabel = (name) => {
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = name;
    container.appendChild(label);
  };

  const letters = charRange('A', 'J');
  letters.forEach(() => createLabel()); //calling the createLabel function inside the window.onload function

  range(1, 99).forEach(number => {
    createLabel(number); //creating label with range from 1-99
    letters.forEach((letter) => {
      const input = document.createElement('input'); //create input element for every single letters
      input.type = 'text';
      input.id = letter + number; //identifier for each input element
      input.ariaLabel = input.id;
      container.appendChild(input); //append the created input element to the container
    })
    
  })
}