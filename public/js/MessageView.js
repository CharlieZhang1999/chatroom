export default class MessageView {
    constructor(message, parent_div, user){
        this.message = message;
        this.user = user;
        this.cur_div = this.creatediv();
        parent_div.appendChild(this.cur_div);
    }

    creatediv(){
        const div = document.createElement('div');
        this.message.username == this.user? div.classList.add("message", "my"):div.classList.add("message", "other");
        div.innerHTML =  `
        <div>
            <p class="meta" > ${this.message.username} <span class="time"> ${this.message.time} </span></p>
            <p class="text">
            ${this.message.message}
            </p>
        </div>`;

        return div;
    }
}