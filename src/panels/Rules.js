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
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
const osName = platform();


const Game = ({ id, go, fetchedUser }) => (
    <Panel id={id}>
        <PanelHeader
			left={<PanelHeaderButton onClick={go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>Правила</PanelHeader>
        <li>
            <strong>Цель игры : </strong> 
            <p>За ограниченное время объяснить партнёру как можно больше слов, вытянутых из шляпы.</p>
        </li>
        <li>
            <strong>Общий ход игры : </strong> 
            <p>Игроки садятся вокруг стола. В каждый момент времени играют два человека — объясняющий и отгадывающий, остальные игроки ждут своей очереди и слушают. Насчет три игрок нажимает кнопку начать игру и пытается обьяснить как можно больше слов за 30 секунд, не нарушая правил. Если Игрок нарушил правила или хочет пропустить слово, он нажимает пропустить, в общий счет он получает -1 одно очка, если отгадывающий назвал правильно слово, то надо нажать кнопку пропустить и он получит +2 очка. </p>
        </li>
        <li>
            <strong>Правила подсказок и угадывания слов: </strong>
        </li>
        <p>
            <li>
                Слово считается отгаданным, если отгадывающий произнёс его в любой форме.
            </li>
            <li>
                Объясняющему нельзя произносить слова, однокоренные загаданному. бъясняющему запрещено произносить аббревиатуры, одна из букв которых обозначает загаданное слово.
            </li>
            <li>
                Объясняющий не может никаким образом апеллировать к буквам и слогам загаданного слова.
            </li>
        </p>
        <li> 
            При объяснении слова нельзя пользоваться переводами
        </li>
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
	}),
};

export default Game;
