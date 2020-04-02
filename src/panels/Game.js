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
import { Alert } from '@vkontakte/vkui'
import axios from 'axios';;

let URL0 = "https://api.duels.asimple.ru/tasks/math/0";
let URL1 = "https://api.duels.asimple.ru/tasks/math/1";
class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.count = this.count.bind(this)
        this.state = {
            minutes: 0,
            secounds: 0,
            word:"aaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            popout: null
        }
        this.amount = 0
        this.start = null
    }
    openPopout = () => {
        let wordnow = this.state.word;
        this.setState({ popout:
            <Alert
            actions={[{
                title: 'Ок.',
                autoclose: true,
                style: 'destructive'
            }]}
            onClose={this.closePopout}>
            <p>Время закончилось.</p>
            <p>Вы набрали {this.amount} очков;</p>
            </Alert>, seconds:0, minutes:0, word:wordnow
        });
    }
    closePopout = () => {
        let wordnow = this.state.word;
        this.setState({ popout: null, seconds:0, minutes:0, word:wordnow});
    }
    count() {        
        var now = new Date().getTime();
        var t = 10000 - (now - this.start);
        var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((t % (1000 * 60)) / 1000);
        let wordnow = this.state.word;
        let popout = this.state.popout;
        this.setState({popout, minutes, seconds, wordnow})
        if (t < 0) {
            this.setState({popout, seconds:0, minutes:0, word:wordnow})
            clearInterval(this.x);
            this.openPopout()
        }
    }

    nextWord(e){
        console.log(e.target.value);
        if (e.target.value == "Отгадано") {
            this.amount += 2;
        }
        else {
            this.amount -= 1;
        }
        axios.get(URL1).then(res => {
            this.setState({minutes:this.state.minutes, seconds:this.state.seconds, word:res.data.task})
        })
    }

    componentDidMount() {
        axios.get(URL0).then(res => {
            this.setState({word: res.data.task})
        })
        this.start = new Date().getTime();
        this.x = setInterval(this.count, 50);
    }

    render() {
        const {minutes, seconds, word, popout} = this.state
        return ( 
            <View activePanel={'game'} popout={popout}>
            <h1>У вас осталось : </h1>
            <div id="clockdiv">
            <div>
                <span className="minutes" id="minute">{minutes}</span>
                <div className="smalltext">Минут</div>
                
            </div>
            <div>
                <span className="seconds" id="second">{seconds}</span>
                <div className="smalltext">Секунд</div>
            </div>
            </div>
            <p>{word}</p>
            <p><input type="submit" onClick={this.nextWord.bind(this)} value={"Отгадано"}/></p>
            <p><input type="submit" onClick={this.nextWord.bind(this)} value={"Пропустить"}/></p>
            </View>
        )
    }
}

const Game = ({ id, go, fetchedUser }) => (
    <Timer/>
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
	}),
};

export default Game;
