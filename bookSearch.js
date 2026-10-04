// US-BB-05 Book fuzzy search + input validation
const bookList = [
  {title:"The Great Gatsby",author:"F. Scott Fitzgerald",type:"new"},
  {title:"1984",author:"George Orwell",type:"second-hand"}
];

function searchBooks(inputText){
  // 输入校验
  if(!inputText || inputText.trim() === ""){
    return {success:false,message:"Search input cannot be empty"};
  }
  if(inputText.length > 100){
    return {success:false,message:"Input too long, max 100 characters"};
  }
  // 模糊检索：匹配书名或者作者
  const keyword = inputText.toLowerCase().trim();
  const result = bookList.filter(book=>
    book.title.toLowerCase().includes(keyword) ||
    book.author.toLowerCase().includes(keyword)
  );
  return {success:true,data:result};
}

module.exports = {searchBooks};

