import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

let rating = 0, place = 1;

const Scoreboard = () => {
    return (
        <div>
            <p> <b class="msg">Ваш рейтинг</b> <br />
            <b class="rating">{rating}</b><br />
            <b class="place">({place} место)</b> </p>
        </div>
    );
};

const Home = ({ id, go, fetchedUser }) => (
	<Panel id={id}>
		<PanelHeader class="panel">Главная</PanelHeader>
		<Group title="Navigation Example">
			<div>
                <Button size="xl" level="2" onClick={go} data-to="game">
					Начать игру в шляпу.
				</Button>
                <Button size="xl" level="2" onClick={go} data-to="rules">
					Правила.
				</Button>
            </div>
		</Group>
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
		}),
	}),
};

export default Home;

