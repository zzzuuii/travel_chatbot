export async function GET(request: Request) {
  // URLについているパラメータを読み取れるようにする
  const { searchParams } = new URL(request.url);
  try {

    const startLat = searchParams.get("startLat");
    const startLng = searchParams.get("startLng");
    const endLat = searchParams.get("endLat");
    const endLng = searchParams.get("endLng");
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    const token = process.env.ONEMAP_ACCESS_TOKEN;

    // Tokenが読み込めているか確認
    if (!token) {
      console.error("ONEMAP_ACCESS_TOKEN is missing");

      return Response.json(
        { error: "ONEMAP_ACCESS_TOKEN is missing" },
        { status: 500 }
      );
    }


    // 必要な情報がすべてそろっている？
    if (
      !startLat ||
      !startLng ||
      !endLat ||
      !endLng ||
      !date ||
      !time
    ) {
      return Response.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    // const start = "1.28668,103.853607"; // Merlion Park
    // const end = "1.2816,103.8636";      // Gardens by the Bay

    // const url =
    //   `https://www.onemap.gov.sg/api/public/routingsvc/route` +
    //   `?start=${start}` +
    //   `&end=${end}` +
    //   `&routeType=pt` +
    //   `&date=08-15-2026` +
    //   `&time=10:00:00` +
    //   `&mode=transit`;

    // 緯度と経度をOneMapが使う形式にまとめる
    const start = `${startLat},${startLng}`; // Merlion Park
    const end = `${endLat},${endLng}`;      // Gardens by the Bay
    // OneMapに送るURLを作る
    const url =
      `https://www.onemap.gov.sg/api/public/routingsvc/route` +
      `?start=${start}` +
      `&end=${end}` +
      `&routeType=pt` +
      `&date=${date}` +
      `&time=${time}` +
      `&mode=transit`;

    console.log("Requesting OneMap:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: token,
      },
    });

    // いったんJSONではなく文字列で受け取る
    const text = await response.text();

    console.log("OneMap status:", response.status);
    console.log("OneMap response:", text);

    if (!response.ok) {
      // 経路が見つからないだけならエラーにしない
      if (response.status === 404) {
        return Response.json({
          noRoute: true,
        });
      }

      // 本当のAPIエラー
      return Response.json(
        {
          error: "OneMap API error",
          onemapStatus: response.status,
          details: text,
        },
        { status: 502 }
      );
    }


    // // OneMapに問い合わせ
    // const response = await fetch(url, {
    //   headers: {
    //     Authorization: token!,
    //   },
    // });

    // OneMapから帰ってきた情報をJSONとして読み込む
    const data = JSON.parse(text);

    return Response.json(data);

  } catch (error: unknown) {
    console.error("route.ts error:", error);

    return Response.json(
      {
        error: "Internal route error",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
