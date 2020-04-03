import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';
import './Game.css'
import { platform, IOS } from '@vkontakte/vkui';
import { Alert } from '@vkontakte/vkui'
import axios from 'axios';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
const osName = platform();

let URL = "https://api.hat.asimple.ru/words/";

class Hat extends React.Component {
    constructor(props) {
        super(props)
        this.count = this.count.bind(this)
        this.state = {
            page: "",
            seconds: 0,
            word:"aaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        }
        this.amount = 0
        this.start = null
    }

    get = (a) => {
        if (a == 0 || (a >= 5 && a <= 20)) {
            return " очков";
        }
        else if (a % 10 == 1) {
            return " очко";
        }
        else if (a % 10 < 5) {
            return " очка";
        }
    }

    finishGame = () => {
        let wordnow = this.state.word;
        this.setState({page:<div><p class="end"> Игра окончена<br/> <span class="result">Ваше количество очков: </span><br/><span class="seconds">{this.amount}</span></p><input type="submit" class="right" onClick={this.nextWord.bind(this)} value={"Новая игра"}/>
            <p><input type="submit" class="repost" onClick={this.nextWord.bind(this)} value={"Поделиться"}/></p>
</div>, seconds:0, word:wordnow});
    }
    
    share = () => {
        bridge.send("VKWebAppShowWallPostBox", {"message": "Я с друзьями набрал " + this.amount + this.get(this.amount) + " в \"Шляпе\"! Попробуй и ты поиграть в шляпу с помощью этого приложения!"});
    }

    count() {        
        var now = new Date().getTime();
        var t = 30000 - (now - this.start);
        var seconds = Math.floor((t % (1000 * 60)) / 1000);
        let wordnow = this.state.word;
        let page = <div>
            <h1 align="center">У вас осталось : </h1>
            <div>
                <h2 align="center" class="seconds">{this.state.seconds}</h2>
            </div>
            <p align="center" class="word"><strong>{this.state.word}</strong><br/>
            <input type="submit" class="right" onClick={this.nextWord.bind(this)} value={"Отгадано"}/>
            <br/><input type="submit" class="wrong" onClick={this.nextWord.bind(this)} value={"Пропустить"}/></p>
            </div>;
        this.setState({page, seconds, wordnow})
        if (t < 0) {
            this.setState({page, seconds:0, word:wordnow})
            clearInterval(this.x);
            this.finishGame();
        }
    }

    nextWord(e){
        console.log(e.target.value);
        if (e.target.value == "Поделиться") {
            this.share();
        }
        if (e.target.value == "Новая игра") {
            this.start = new Date().getTime();
            this.amount = 0;
            this.x = setInterval(this.count, 10);
        }
        else if (e.target.value == "Отгадано") {
            this.amount += 2;
        }
        else {
            this.amount -= 1;
        }
        axios.get(URL + this.props.userid).then(res => {
            this.setState({page:this.state.all, seconds:this.state.seconds, word:res.data.word})
        })
    }

    componentDidMount() {
        axios.get(URL + this.props.userid).then(res => {
            this.setState({word: res.data.word})
        })
        this.start = new Date().getTime();
        this.x = setInterval(this.count, 10);
    }

    render() {
        return ( 
            <div> {this.state.page} </div>
        )
    }
}

const Game = ({ id, go, fetchedUser }) => (
    <Panel id={id}>
        <PanelHeader
			left={<PanelHeaderButton onClick={go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>Шляпа</PanelHeader>
        <Hat userid={fetchedUser.id}/>
    </Panel>
);

Game.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
        id: PropTypes.number
	}),
};

export default Game;
