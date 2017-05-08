<%@ page contentType="text/html; charset=Utf-8" %>
<html>
<head>
<style type="text/css">

body, th, td {
  font-size: 9pt;
}

</style>
</head>
<body>
<form method="get" action="<%= request.getContextPath() %>/qrcode" target="f2">

    <table border="1">
      <tr>
        <th>出力形式</th>
        <td>
          <select name="o">
            <option value="text/plain">テキスト</option>
            <option value="image/gif" selected>画像(GIF)</option>
            <option value="image/jpeg">画像(JPEG)</option>
            <option value="image/png">画像(PNG)</option>
          </select>
        </td>
      </tr>
      <tr>
        <th>テキスト</th>
        <td>
          <textarea name="d" rows="5" cols="40"></textarea>
        </td>
      </tr>
      <tr>
        <th>誤り訂正レベル</th>
        <td>
          <select name="e">
            <option value="L" selected>L 7%</option>
            <option value="M">M 15%</option>
            <option value="Q">Q 25%</option>
            <option value="H">H 30%</option>
          </select>
        </td>
      </tr>
      <tr>
        <th>種別</th>
        <td>
          <select name="t">
            <option value="0">自動</option>
            <% for (int i = 1; i <= 10; i++) { %>
            <option value="<%= i %>"><%= i %></option>
            <% } %>
          </select>
        </td>
      </tr>
      <tr>
        <th>余白<br/>※出力形式が画像の場合のみ有効</th>
        <td>
          <select name="m">
            <% for (int i = 0; i <= 32; i++) { %>
            <option value="<%= i %>"><%= i %></option>
            <% } %>
          </select>
        </td>
      </tr>
      <tr>
        <th>セルサイズ<br/>※出力形式が画像の場合のみ有効</th>
        <td>
          <select name="s">
            <% for (int i = 1; i <= 4; i++) { %>
            <option value="<%= i %>" <%= (i == 2)? "selected" : "" %>><%= i %></option>
            <% } %>
          </select>
        </td>
      </tr>
    </table>

    <input type="submit" value="送信"/>

</form>
</body>
</html>
