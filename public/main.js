var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
var place = document.getElementsByClassName("place");

Array.from(place).forEach(function(element) {
      element.addEventListener('click', function(e){
        // const name = this.parentNode.parentNode.childNodes[1].innerText
        // const msg = this.parentNode.parentNode.childNodes[3].innerText
        // const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        // fetch('messages', {
        //   method: 'put',
        //   headers: {'Content-Type': 'application/json'},
        //   body: JSON.stringify({
        //     'name': name,
        //     'msg': msg,
        //     'thumbUp':thumbUp
        //   })
        // })
        // .then(response => {
        //   if (response.ok) return response.json()
        // })
        // .then(data => {
        //   console.log(data)
        //   window.location.reload(true)
        // })
        console.log("clicked on!!!!" + e.target.innerText);
      });
});

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const category = this.parentNode.parentNode.childNodes[3].innerText
        const icon = this.parentNode.parentNode.childNodes[5].src
        const location = this.parentNode.parentNode.childNodes[7].innerText
        const city = this.parentNode.parentNode.childNodes[9].innerText
        const saved = this.parentNode.parentNode.childNodes[11]
        // const msg = this.parentNode.parentNode.childNodes[3].innerText
        // const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        console.log(this.parentNode.parentNode.childNodes);
        saved.innerText = 'Saved'
        fetch('favs', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'category': category,
            'icon':icon,
            'location': location,
            'city':city
          })
        })
        .then(response => {
          if (response.ok) return response.json()
            // Add some stylying to notify the client that item has been selected

            window.location.reload()
        })
        // .then(data => {
        //   console.log(data)

        // })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const _id = element.getAttribute('data-id')
// console.log(element.getAttribute('data-id'))
const name = this.parentNode.parentNode.childNodes[1].innerText
const location = this.parentNode.parentNode.childNodes[7].innerText
console.log("name, location: ", name, location);
// console.log(this.parentNode.parentNode.childNodes);
        fetch('favs', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'location': location
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
