import User from "./User"

export const updateBananaCount = async (userId: string, count: number) => {
    try {
        await User.updateOne(
            { _id: userId },
            { $inc: { bananaCount: count } },
        );
        console.log(`Saved ${count} bananas for user ${userId}`);
    } catch (error) {
        console.error("Error saving bananas:", error);
    }
};
