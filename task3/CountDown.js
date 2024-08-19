document.addEventListener('DOMContentLoaded', function(){
   class CountDown extends HTMLElement{
       constructor(){
           super();
            //class attributes
           this.date = new Date(this.getAttribute('date'));
           this.message = this.getAttribute('message');
           this.countdownInterval = null;
           //assign shadow root
           const shadowRoot = this.attachShadow({
               mode: 'open'
           });

           this.formatter = new Intl.RelativeTimeFormat(undefined, {
               numeric: "auto",
           })

           this.DIVISIONS = [
               { amount: 60, name: "seconds" },
               { amount: 60, name: "minutes" },
               { amount: 24, name: "hours" },
               { amount: 7, name: "days" },
               // { amount: 4.34524, name: "weeks" },
               // { amount: 12, name: "months" },
               // { amount: Number.POSITIVE_INFINITY, name: "years" },
           ]

           //styles for the component
           const style = document.createElement('style');
           style.innerHTML= `
                .card{
                    padding: 1rem;
                    border: 2px solid black;
                    box-shadow: 2px 2px 5px 2px rgba(0,0,0, 0.4);
                    width: 200px;
                }            
                .mb-1{
                    margin-top: 0;
                    margin-bottom: 1rem;
                }
                .hide{
                    display: none;
                }
           `;

           //dom element
           const div = document.createElement('div');
           div.classList.add('card');

           const heading=  document.createElement('h1');
           heading.innerHTML = "CountDown";
           heading.classList.add('mb-1');

           const message = document.createElement('output');
           message.innerHTML = this.message;
           message.classList.add('mb-1');
           message.classList.add('hide');

           const date = document.createElement('time');
           date.classList.add('mb-1');

           div.appendChild(heading);
           div.appendChild(message);
           div.appendChild(date);

           //append to the shadow root
           shadowRoot.appendChild(style);
           shadowRoot.appendChild(div);
       }

       //onmounted
       connectedCallback(){
            //create 1s countdown interval
           this.countdownInterval = setInterval(()=>{
                this.update();//update the bloody timer
           }, 1000);

       }
       update(){
           this.shadowRoot.querySelector('time').innerHTML  = `${this.formatTimeAgo(this.date)}`;
       }

       formatTimeAgo(date) {
           let duration = (date - new Date()) / 1000;
           if(duration <= 0){
               clearInterval(this.countdownInterval);
               //display the message and hide the timer
               this.shadowRoot.querySelector('time').classList.add('hide');
               this.shadowRoot.querySelector('output').classList.remove('hide');
           }
           let seconds = '';
           let minutes = '';
           let hours = '';
           for (let i = 0; i < this.DIVISIONS.length; i++) {
               const division = this.DIVISIONS[i]
                switch(i){
                    case 0:
                        seconds = Math.floor(duration % division.amount);
                        break;
                    case 1:
                        minutes = Math.floor(duration % division.amount);
                        break;
                    case 2:
                        hours = Math.floor(duration % division.amount);
                        break;
                    default:break;
                }
               // if (Math.abs(duration) < division.amount) {
               if(i === this.DIVISIONS.length - 1){
                   return `${this.formatter.format(Math.floor(duration), division.name).substring(2)} ${hours.toString().padStart(2 , '0')}:${minutes.toString().padStart(2 , '0')}:${seconds.toString().padStart(2 , '0')} left`;
               }
               duration /= division.amount
           }
       }
   }

   //define the custom components
    if( "customElements" in window){
        customElements.define('count-down', CountDown);
    }
});