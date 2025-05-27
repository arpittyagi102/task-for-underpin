import User from "./User"

export const updateBananaCount = async (userId: string, count: number) => {
    try {
        await User.updateOne(
            { _id: userId },
            { bananaCount: count },
        );
    } catch (error) {
        console.error("Error saving bananas:", error);
    }
};
