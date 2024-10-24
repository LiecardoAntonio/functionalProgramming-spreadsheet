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

      input.onchange = update; //In your window.onload function, you need to tell your input elements to call the update function when the value changes. You can do this by directly setting the onchange property.
    })
    
  })
}

//In order to run your spreadsheet functions, you need to be able to parse and evaluate the input string. This is a great time to use another function.
const evalFormula = (x, cells) => {
  const idToText = id => cells.find(cell => cell.id === id).value; //Your idToText function currently returns an input element.
  console.log(`eval formula = ${idToText}`);

  /*
  
  1. You need to be able to match cell ranges in a formula. Cell ranges can look like A1:B12 or A3:A25. You can use a regular expression to match these patterns. Start by declaring a rangeRegex variable and assign it a regular expression that matches A through J (the range of columns in your spreadsheet). Use a capture group with a character class to achieve this. 
  
  2. After matching a cell letter successfully, your rangeRegex needs to match the cell number. Cell numbers in your sheet range from 1 to 99. Add a capture group after your letter capture group. Your new capture group should match one or two digits – the first digit should be 1 through 9, and the second digit should be 0 through 9. The second digit should be optional.

  3. Ranges are separated by a colon. After your two capture groups, your rangeRegex should look for a colon.

  4. After your rangeRegex finds the :, it needs to look for the same letter and number pattern as it did before.

  5. Finally, make your rangeRegex global and case-insensitive.

  */
  // const rangeRegex = /([A-J])([1-9][0-9]?)/;
  const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;

  //Declare a rangeFromString arrow function that takes two parameters, num1 and num2. The function should implicitly return the result of calling range with num1 and num2 as arguments.
  const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));


  //using currying concept
  // const elemValue = num => {
  //   const inner = character => {
  //     return idToText(character + num);
  //   }
  //   return inner;
  // }
  //update the above function to arrow function:
  const elemValue = num => character => idToText(character+num);

  //currying in arrow function
  // const addCharacters = character1 => character2 => num => charRange(character1, character2);
  //the function above equals to:
  /*
  const addCharacters = function(character1) {
      return function(character2) {
          return function(num) {
              return charRange(character1, character2);
          };
      };
  };
  */ 
 //Your addCharacters function ultimately returns a range of characters. You want it to return an array of cell ids. Chain the .map() method to your charRange() call
 const addCharacters = character1 => character2 => num => charRange(character1, character2).map(elemValue(num)); //Because elemValue returns a function, your addCharacters function ultimately returns an array of function references. You want the .map() method to run the inner function of your elemValue function, which means you need to call elemValue instead of reference it. Pass num as the argument to your elemValue function.
};

//function to make an update to the input element
const update = event => {
  const element = event.target;
  console.log(element);
  const value = element.value.replace(/\s/g, ''); //replace all space in the input element
  if (!value.includes(element.id) && value.charAt(0) === '=') {
    //check if the value does not include the id of the element. Also spreadsheet software typically uses = at the beginning of a cell to indicate a calculation should be used, and spreadsheet functions should be evaluated. You should use the && operator to add a second condition to your if statement that also checks if the first character of value is "=". You may use [0], .startsWith(), or .charAt(0).


  }
}

//-----------------creating the excel built-in function---------
const sum = (nums) => nums.reduce((el, acc) => acc+el, 0);

const isEven = (num) => num%2===0;

const average = (nums) => sum(nums)/nums.length; //using the created sum function before

const median = (nums) => {
  const sorted = nums.slice().sort((a, b) => a-b);
  const length = sorted.length;
  const middle = length/2-1;
  return isEven(length) ? average([sorted[middle], sorted[middle+1]]) : sorted[Math.ceil(middle)]; //Using ternary syntax, check if length is even using your isEven function. If it is, return the average of the number at the middle index and the number after that. If it's odd, return the number at the middle index – you'll need to round the middle value up.
  //NOTE: this part: [sorted[middle], sorted[middle+1]], is equal to an array of [value1, value2], so it is 1 array with two element.
}

//object literal that store every available function in the spreadsheet
const spreadsheetFunctions = {
  sum,
  average,
  median
}
