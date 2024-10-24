//const infixToFunction = {};, To parse these expressions, you will need to map the symbols to relevant functions. Declare an infixToFunction variable, and assign it an empty object.
const infixToFunction = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y
}

//Now that you have your infix functions, you need a way to evaluate them.
const infixEval = (str, regex) => str.replace(regex, (_match, arg1, operator, arg2) => infixToFunction[operator](parseFloat(arg1), parseFloat(arg2)));

//Now that you can evaluate mathematical expressions, you need to account for order of operations. Declare a highPrecedence function that takes a str parameter.
const highPrecedence = str => {
  const regex = /([\d.]+)([*\/])([\d.]+)/;
  const str2 = infixEval(str, regex);
  return str2 === str ? str : highPrecedence(str2); //Your infixEval function will only evaluate the first multiplication or division operation, because regex isn't global. This means you'll want to use a recursive approach to evaluate the entire string. If infixEval does not find any matches, it will return the str value as-is. Using a ternary expression, check if str2 is equal to str. If it is, return str, otherwise return the result of calling highPrecedence() on str2.
}

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

  //The second argument to the .replace() method does not have to be a string. You can instead pass a callback function to run more complex logic on the matched string. The callback function should have a parameter for each capture group in the regular expression. In your case, rangeRegex has four capture groups: the first letter, the first numbers, the second letter, and the second numbers.
  //  const rangeExpanded = x.replace(rangeRegex, (match, char1, num1, char2, num2) => rangeFromString(num1, num2).map(addCharacters(char1)(char2))); //Your addCharacters(char1) is also returning a function, which returns another function. You need to make another function call to access that innermost function reference for the .map() callback.

  //Now that your .map() function is receiving the returned num => charRange(...).map(...) function reference from the curried addCharacters calls, it will properly iterate over the elements and pass each element as n to that function.
  const rangeExpanded = x.replace(rangeRegex, (_match, char1, num1, char2, num2) => rangeFromString(num1, num2).map(addCharacters(char1)(char2))); //You'll notice that you are not using your match parameter. In JavaScript, it is common convention to prefix an unused parameter with an underscore _.

  const cellRegex = /[A-J][1-9][0-9]?/gi;
  const cellExpanded = rangeExpanded.replace(cellRegex, match => idToText(match.toUpperCase()));

  //Now you can start applying your function parser to your evalFormula logic. Declare a functionExpanded variable, and assign it the result of calling applyFunction with your cellExpanded string.
  const functionExpanded = applyFunction(cellExpanded);
  return functionExpanded === x ? functionExpanded : evalFormula(functionExpanded, cells); //Like you did with your highPrecedence() function, your evalFormula() function needs to ensure it has evaluated and replaced everything.
};

//function to make an update to the input element
const update = event => {
  const element = event.target;
  console.log(element);
  const value = element.value.replace(/\s/g, ''); //replace all space in the input element
  //check if a function is called or not
  if (!value.includes(element.id) && value.charAt(0) === '=') {
    //check if the value does not include the id of the element. Also spreadsheet software typically uses = at the beginning of a cell to indicate a calculation should be used, and spreadsheet functions should be evaluated. You should use the && operator to add a second condition to your if statement that also checks if the first character of value is "=". You may use [0], .startsWith(), or .charAt(0).

    element.value = evalFormula(value.slice(1), Array.from(document.getElementById("container").children)); //The first argument for your evalFormula call needs to be the contents of the cell (which you stored in value). However, the contents start with an = character to trigger the function, so you need to pass the substring of value starting at index 1. > You can quickly get all cells from your page by getting the #container element by its id and accessing the children property of the result. Pass that to your evalFormula() call as the second parameter. > Unfortunately, that children property is returning a collection of elements, which is array-like but not an array. Wrap your second argument in Array.from() to convert it to an array.
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
  '': args => args, //Finally, to handle potential edge cases, add an empty string property (you will need to use quotes) which is a function that takes a single argument and returns that argument.
  sum,
  average,
  median,
  someeven: nums => nums.some(isEven),
  everyeven: nums => nums.every(isEven),

  even: nums => nums.filter(isEven),
  firsttwo: nums => nums.splice(0, 2),
  lasttwo: nums => nums.splice(nums.length-2, 2),
  has2: nums => nums.includes(2),
  increment: nums => nums.map(el => el+1),
  random: ([x, y]) => Math.floor(Math.random() * y + x),
  //below also works
  // random: nums => {
  //   const [first, second] = nums.slice(0, 2); // Get the first two numbers from the array
  //   return Math.floor(Math.random() * (first + second - first)) + first;
  // }
  range: nums => range(nums[0], nums[1]), //create an array in range
  nodupes: nums => [...new Set(nums)] //no dupe in the array
}

//Now you can start applying your function parsing logic to a string. Declare a function called applyFunction, which takes a str parameter.
const applyFunction = (str) => {
  const noHigh = highPrecedence(str); //First you need to handle the higher precedence operators. 
  const infix = /([\d.]+)([+-])([\d.]+)/; //Now that you've parsed and evaluated the multiplication and division operators, you need to do the same with the addition and subtraction operators. assign a regular expression that matches a number (including decimal numbers) followed by a + or - operator followed by another number.
  const str2 = infixEval(noHigh, infix);
  const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i; //This expression will look for function calls like sum(1, 4).

  const toNumberList = args => args.split(',').map(parseFloat);

  const apply = (fn, args) => spreadsheetFunctions[fn.toLowerCase()](toNumberList(args)); //The fn parameter will be passed the name of a function, such as "SUM". Update apply to implicitly return the function from your spreadsheetFunctions object using the fn variable as the key for the object access. Remember that fn might not contain a lowercase string, so you'll need to convert it to a lowercase string. Your apply function is returning the spreadsheet function, but not actually applying it. Update apply to call the function. Pass in the result of calling toNumberList with args as an argument.

  return str2.replace(functionCall, (match, fn, args) => spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? apply(fn, args) : match);
};
