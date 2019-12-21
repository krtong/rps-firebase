let arr = [1, 2, 3]
// let cb = a => a === 2 ? true : 



const test = [1, 2, 3].reduce((acc, cur) => cur === 2 ? true : acc, false)

console.log(test)