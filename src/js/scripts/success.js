export default function successMsg() {
document.getElementById('submit-button').addEventListener('click', function(event) {
    event.preventDefault();

    document.getElementById('form').style.display = 'none';

    document.getElementById('success-message').style.display = 'block';
  });
}