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
import './Main.css'
import { platform, IOS } from '@vkontakte/vkui';
import { Alert } from '@vkontakte/vkui'
import axios from 'axios';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';
import Icon24Back from '@vkontakte/icons/dist/24/back';
const osName = platform();

let URL = "https://api.hat.asimple.ru/words/";

class Hat extends React.Component {
    constructor(props) {
        super(props)
        this.count = this.count.bind(this)
        this.state = {
            page: <div><p class="end"><br/></p><input type="submit" class="right" onClick={this.nextWord.bind(this)} value={"Новая игра"}/>
            <p><input type="submit" class="repost" onClick={this.props.go} data-to="rules" value={"Правила"}/></p>
</div>,
            seconds: 0,
            word:"Вау, вы уже сыграли все слова из нашего списка",
            id: 0
        }
        this.amount = 0
        this.start = null
    }

    get = (a) => {
        if (a % 10 == 0 || (a >= 5 && a <= 20) || (a >= -5 && a <= -20)) {
            return " очков";
        }
        else if (a % 10 == 1 || a % 10 == -1) {
            return " очко";
        }
        else if (a % 10 < 5 || a % 10 > -5) {
            return " очка";
        }
    }

    finishGame = () => {
        let wordnow = this.state.word;
        this.setState({page:<div><p class="end"> Игра окончена<br/> <span class="result">ВАШ РЕЗУЛЬТАТ</span><br/><span class="amount">{this.amount} {this.get(this.amount)}</span></p><input type="submit" class="right" onClick={this.nextWord.bind(this)} value={"Новая игра"}/>
            <p><input type="submit" class="repost" onClick={this.nextWord.bind(this)} value={"Поделиться"}/></p>
</div>, seconds:0, word:wordnow});
    }
    
    share = () => {
        console.log(1);
        bridge.send("VKWebAppShowWallPostBox", {"message": "Я с друзьями набрал " + this.amount + this.get(this.amount) + " в \"Шляпе\"! Попробуй и ты поиграть в шляпу с помощью https://vk.com/app7386374!"}).then(res => {
            this.setState({page:<div><p class="end"> Игра окончена<br/> <span class="result">ВАШ РЕЗУЛЬТАТ</span><br/><span class="amount">{this.amount} {this.get(this.amount)}</span></p><input type="submit" class="right" onClick={this.nextWord.bind(this)} value={"Новая игра"}/> </div>, word:"why"})
            console.log(res)});
    }

    count() {        
        var now = new Date().getTime();
        var t = 30000 - (now - this.start);
        var seconds = Math.floor((t % (1000 * 60)) / 1000);
        let wordnow = this.state.word;
        let page = <div>
            <div>
                <h2 align="center" class="seconds">{this.state.seconds}</h2>
            </div>
            <p class="word">{this.state.word}<br/>
            <input type="submit" class="wrong" onClick={this.nextWord.bind(this)} value={"Пропуск"}/>
            <input type="submit" class="right" onClick={this.nextWord.bind(this)} value={"Угадано"}/></p>
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
            return;
        }
        else if (e.target.value == "Новая игра") {
            this.start = new Date().getTime();
            this.amount = 0;
            this.x = setInterval(this.count, 1);
        }
        else if (e.target.value == "Угадано") {
            this.amount += 2;
        }
        else {
            this.amount -= 1;
        }
        axios.get(URL + this.state.id).then(res => {
            this.setState({page:this.state.all, seconds:this.state.seconds, word:res.data.word})
        })
    }

    componentDidMount() {
        bridge.send("VKWebAppGetUserInfo", {}).then(e => {this.setState({id: e.id})});
        axios.get(URL + this.state.id).then(res => {
            this.setState({word: res.data.word})
        })
    }

    render() {
        return ( 
            <div> 
                {this.state.page} 
            </div>
        )
    }
}

const Home = ({ id, go, fetchedUser }) => (
    <Panel id={id}>
        <PanelHeader
			left={<PanelHeaderButton onClick={go} data-to="rules">
				{Icon28ErrorOutline}
			</PanelHeaderButton>}
		>Шляпа</PanelHeader>
        <Hat go={go}/>
    </Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		})
	}),
};

export default Home;

