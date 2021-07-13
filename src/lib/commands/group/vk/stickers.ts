import utils from "rus-anonym-utils";

import VK from "../../../VK/core";
import InternalUtils from "../../../utils/core";
import { GroupCommand } from "../../../utils/lib/commands";

new GroupCommand(/^(?:\/стикеры)(?:\s(.*))?$/i, async function (message) {
	await message.loadMessagePayload();
	let userID;
	try {
		userID = await InternalUtils.groupCommands.getUserId(message);
	} catch (error) {
		return await message.sendMessage({
			message: error.message,
		});
	}

	const userStickers = await utils.vk.user.getUserStickerPacks(
		VK.fakes.getUserFakeAPI().options.token,
		userID,
		true,
	);

	const stickersText = userStickers.items
		.map((stickerPack) => stickerPack.title)
		.join(", ");

	return message.sendMessage({
		message: `У @id${userID} ${utils.string.declOfNum(
			userStickers.items.length,
			["найден", "найдено", "найдено"],
		)} ${utils.number.separator(
			userStickers.items.length,
			".",
		)} ${utils.string.declOfNum(userStickers.items.length, [
			"стикерпак",
			"стикерпака",
			"стикерпаков",
		])} на сумму ${utils.number.separator(userStickers.totalPrice * 7, ".")}₽
Платных: ${userStickers.stats.paid}
Бесплатных: ${userStickers.stats.free}
Анимированных: ${userStickers.stats.animated}
Обычных: ${userStickers.stats.notAnimated}
Стилей: ${userStickers.stats.styles}
Не стилей: ${userStickers.stats.notStyles}
\n\n${stickersText.length < 3900 ? stickersText : ""}`,
		disable_mentions: true,
	});
});
