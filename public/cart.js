// Proceed to Checkout
const payBtn = document.getElementById('btn-buy');

payBtn.addEventListener('click', () => {
    fetch('/stripe-checkout', {
        method: "post",
        headers: new Headers({"Content-Type": "application/Json" }),
    
        body: JSON.stringify({
            items: JSON.parse(localStorage.getItem("cart")),
        }),
    })
    .then((res) => res.json())
    .then((url) => {
        location.href = url;
    })
    .catch((err) => console.log(err));
});
