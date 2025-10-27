import React, { useState } from 'react';
import { AlertCircle, Users, TrendingUp, Info } from 'lucide-react';

const InheritanceTroublePredictor = () => {
  const [marriageStatus, setMarriageStatus] = useState('married');
  const [numSiblings, setNumSiblings] = useState(0);
  const [hasDeceasedSibling, setHasDeceasedSibling] = useState(false);
  const [numNephews, setNumNephews] = useState(0);
  const [spouseStatus, setSpouseStatus] = useState('alive');
  const [numChildren, setNumChildren] = useState(2);
  const [hasDeceasedChild, setHasDeceasedChild] = useState(false);
  const [numGrandchildren, setNumGrandchildren] = useState(0);
  const [numSiblingsIfNoChildren, setNumSiblingsIfNoChildren] = useState(0);
  const [hasDeceasedSiblingIfNoChildren, setHasDeceasedSiblingIfNoChildren] = useState(false);
  const [numNephewsIfNoChildren, setNumNephewsIfNoChildren] = useState(0);
  const [isRemarried, setIsRemarried] = useState(false);
  const [numChildrenFromPrevious, setNumChildrenFromPrevious] = useState(0);
  const [hasDeceasedChildFromPrevious, setHasDeceasedChildFromPrevious] = useState(false);
  const [numGrandchildrenFromPrevious, setNumGrandchildrenFromPrevious] = useState(0);
  const [hasAdoptedChild, setHasAdoptedChild] = useState(false);
  const [numAdoptedChildren, setNumAdoptedChildren] = useState(0);
  const [hasDeceasedAdopted, setHasDeceasedAdopted] = useState(false);
  const [numAdoptedGrandchildren, setNumAdoptedGrandchildren] = useState(0);
  const [result, setResult] = useState(null);

  const troubleData = {
    simple: { rate: 8.8, lowerCI: 4.6, upperCI: 13.1, description: '単純な家族構成' },
    moderate: { rate: 24.6, lowerCI: 13.4, upperCI: 35.7, description: '中程度の複雑さ' },
    complex: { rate: 88.6, lowerCI: 78.0, upperCI: 99.1, description: '複雑な家族構成' }
  };

  const calculateComplexity = () => {
    if (isRemarried || hasAdoptedChild) return 'complex';
    if (marriageStatus === 'single') {
      const totalSiblings = numSiblings + (hasDeceasedSibling ? numNephews : 0);
      if (totalSiblings > 0) return 'complex';
      return 'moderate';
    }
    if (numChildren === 0) {
      const totalSiblings = numSiblingsIfNoChildren + (hasDeceasedSiblingIfNoChildren ? numNephewsIfNoChildren : 0);
      if (totalSiblings > 0) return 'complex';
      return 'moderate';
    }
    let totalHeirs = (spouseStatus === 'alive' ? 1 : 0);
    totalHeirs += numChildren + (hasDeceasedChild ? numGrandchildren : 0);
    totalHeirs += numChildrenFromPrevious + (hasDeceasedChildFromPrevious ? numGrandchildrenFromPrevious : 0);
    totalHeirs += numAdoptedChildren + (hasDeceasedAdopted ? numAdoptedGrandchildren : 0);
    if (totalHeirs >= 5) return 'complex';
    const hasSuccession = hasDeceasedChild || hasDeceasedChildFromPrevious;
    const totalDeceasedChildren = (hasDeceasedChild ? 1 : 0) + (hasDeceasedChildFromPrevious ? 1 : 0);
    const totalGrandchildren = (hasDeceasedChild ? numGrandchildren : 0) + (hasDeceasedChildFromPrevious ? numGrandchildrenFromPrevious : 0);
    if (!isRemarried && !hasAdoptedChild && numChildrenFromPrevious === 0) {
      if (!hasSuccession || (totalDeceasedChildren === 1 && totalGrandchildren <= 2)) {
        if (numChildren >= 1 && numChildren <= 2) return 'simple';
      }
    }
    if (numChildren >= 3 || totalHeirs >= 3) return 'moderate';
    return 'moderate';
  };

  const handleCalculate = () => {
    const complexity = calculateComplexity();
    setResult({ complexity, ...troubleData[complexity] });
  };

  const getRiskLevel = (rate) => {
    if (rate < 15) return { level: '低', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (rate < 50) return { level: '中', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    return { level: '高', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">相続トラブル発生予測</h1>
        </div>
        <p className="text-gray-600 mb-8">家族構成を入力すると、相続トラブル発生の可能性を予測します</p>

        <div className="space-y-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">結婚について</h3>
            <div className="grid grid-cols-3 gap-3">
              {['single', 'married', 'wasMarried'].map((status, idx) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer p-3 bg-white rounded border-2 border-gray-200 hover:border-blue-400 transition">
                  <input type="radio" name="marriage" value={status} checked={marriageStatus === status} onChange={(e) => setMarriageStatus(e.target.value)} className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{['結婚していない', '結婚している', '結婚していた'][idx]}</span>
                </label>
              ))}
            </div>

            {marriageStatus === 'single' && (
              <div className="mt-6 space-y-4 pl-4 border-l-4 border-blue-300">
                <div className="flex items-start gap-2 bg-yellow-50 p-3 rounded">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">両親が相続人になります。両親が亡くなっている場合は、兄弟姉妹が相続人になります。</p>
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">兄弟姉妹の人数</label>
                  <input type="number" min="0" max="20" value={numSiblings} onChange={(e) => setNumSiblings(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                {numSiblings > 0 && (
                  <>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={hasDeceasedSibling} onChange={(e) => setHasDeceasedSibling(e.target.checked)} className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-medium">既に亡くなっている兄弟姉妹がいる</span>
                    </label>
                    {hasDeceasedSibling && (
                      <div className="ml-8">
                        <label className="block text-base font-medium mb-2 text-gray-700">亡くなっている兄弟姉妹の子供（甥姪）の人数</label>
                        <input type="number" min="0" max="20" value={numNephews} onChange={(e) => setNumNephews(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {(marriageStatus === 'married' || marriageStatus === 'wasMarried') && (
              <div className="mt-6 space-y-4 pl-4 border-l-4 border-blue-300">
                <div className="grid grid-cols-2 gap-3">
                  {['alive', 'deceased'].map((status, idx) => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer p-3 bg-white rounded border-2 border-gray-200 hover:border-blue-400 transition">
                      <input type="radio" name="spouse" value={status} checked={spouseStatus === status} onChange={(e) => setSpouseStatus(e.target.value)} className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{['配偶者がいる', '配偶者は亡くなっている'][idx]}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">配偶者との間の子供の人数</label>
                  <input type="number" min="0" max="10" value={numChildren} onChange={(e) => setNumChildren(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                {numChildren === 0 && (
                  <div className="space-y-4 bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">子供がいない場合、配偶者と両親が相続人になります。両親が亡くなっている場合は、兄弟姉妹が相続人になります。</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium mb-2">兄弟姉妹の人数</label>
                      <input type="number" min="0" max="20" value={numSiblingsIfNoChildren} onChange={(e) => setNumSiblingsIfNoChildren(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    {numSiblingsIfNoChildren > 0 && (
                      <>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={hasDeceasedSiblingIfNoChildren} onChange={(e) => setHasDeceasedSiblingIfNoChildren(e.target.checked)} className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">既に亡くなっている兄弟姉妹がいる</span>
                        </label>
                        {hasDeceasedSiblingIfNoChildren && (
                          <div className="ml-8">
                            <label className="block text-base font-medium mb-2 text-gray-700">亡くなっている兄弟姉妹の子供（甥姪）の人数</label>
                            <input type="number" min="0" max="20" value={numNephewsIfNoChildren} onChange={(e) => setNumNephewsIfNoChildren(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {numChildren > 0 && (
                  <>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={hasDeceasedChild} onChange={(e) => setHasDeceasedChild(e.target.checked)} className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-medium">既に亡くなっている子供がいる</span>
                    </label>
                    {hasDeceasedChild && (
                      <div className="ml-8">
                        <label className="block text-base font-medium mb-2 text-gray-700">亡くなっている子供の子供（孫）の人数</label>
                        <input type="number" min="0" max="10" value={numGrandchildren} onChange={(e) => setNumGrandchildren(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {(marriageStatus === 'married' || marriageStatus === 'wasMarried') && (
            <>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">再婚について</h3>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input type="checkbox" checked={isRemarried} onChange={(e) => setIsRemarried(e.target.checked)} className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-medium">再婚している</span>
                </label>
                {isRemarried && (
                  <div className="space-y-4 pl-4 border-l-4 border-yellow-300">
                    <div>
                      <label className="block text-lg font-medium mb-2">前配偶者との間の子供の人数</label>
                      <input type="number" min="0" max="10" value={numChildrenFromPrevious} onChange={(e) => setNumChildrenFromPrevious(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    {numChildrenFromPrevious > 0 && (
                      <>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={hasDeceasedChildFromPrevious} onChange={(e) => setHasDeceasedChildFromPrevious(e.target.checked)} className="w-5 h-5 text-blue-600" />
                          <span className="text-lg font-medium">既に亡くなっている子供がいる</span>
                        </label>
                        {hasDeceasedChildFromPrevious && (
                          <div className="ml-8">
                            <label className="block text-base font-medium mb-2 text-gray-700">亡くなっている子供の子供（孫）の人数</label>
                            <input type="number" min="0" max="10" value={numGrandchildrenFromPrevious} onChange={(e) => setNumGrandchildrenFromPrevious(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">養子について</h3>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input type="checkbox" checked={hasAdoptedChild} onChange={(e) => setHasAdoptedChild(e.target.checked)} className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-medium">養子がいる</span>
                </label>
                {hasAdoptedChild && (
                  <div className="space-y-4 pl-4 border-l-4 border-purple-300">
                    <div>
                      <label className="block text-lg font-medium mb-2">養子の人数</label>
                      <input type="number" min="1" max="10" value={numAdoptedChildren} onChange={(e) => setNumAdoptedChildren(parseInt(e.target.value) || 1)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={hasDeceasedAdopted} onChange={(e) => setHasDeceasedAdopted(e.target.checked)} className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-medium">既に亡くなっている養子がいる</span>
                    </label>
                    {hasDeceasedAdopted && (
                      <div className="ml-8 space-y-2">
                        <label className="block text-base font-medium text-gray-700">養子縁組後に生まれた養子の子の人数</label>
                        <input type="number" min="0" max="10" value={numAdoptedGrandchildren} onChange={(e) => setNumAdoptedGrandchildren(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        <div className="flex items-start gap-2 bg-purple-100 p-3 rounded">
                          <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">養子縁組前に生まれていた養子の子は、相続人とはなりません。</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <button onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2">
          <TrendingUp className="w-5 h-5" />
          トラブル発生リスクを診断する
        </button>

        {result && (
          <div className="mt-8 space-y-6">
            <div className={`p-6 rounded-lg border-2 ${getRiskLevel(result.rate).bgColor} ${getRiskLevel(result.rate).borderColor}`}>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className={`w-6 h-6 ${getRiskLevel(result.rate).color}`} />
                <h2 className="text-2xl font-bold text-gray-800">診断結果</h2>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">家族構成の分類</p>
                <p className="text-xl font-semibold text-gray-800">{result.description}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">トラブル発生の可能性</p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className={`text-5xl font-bold ${getRiskLevel(result.rate).color}`}>{result.rate}%</span>
                  <span className={`text-2xl font-bold ${getRiskLevel(result.rate).color} px-4 py-1 rounded-full ${getRiskLevel(result.rate).bgColor} border-2 ${getRiskLevel(result.rate).borderColor}`}>リスク: {getRiskLevel(result.rate).level}</span>
                </div>
                <p className="text-sm text-gray-600">過去262件の実例では、{result.rate}%の確率でトラブルが発生しています</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2 font-semibold">95%信頼区間</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-800">{result.lowerCI}%</span>
                  <span className="text-xl text-gray-500">〜</span>
                  <span className="text-2xl font-bold text-gray-800">{result.upperCI}%</span>
                </div>
                <p className="text-sm text-gray-500">統計的には、95%の確率でこの範囲内にトラブル発生率が収まります</p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">推奨される対策</h3>
              <ul className="space-y-2">
                {result.rate < 15 ? (
                  <>
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>比較的トラブルのリスクは低いですが、念のため遺言書の作成をご検討ください</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>家族で相続について話し合っておくことをお勧めします</span></li>
                  </>
                ) : result.rate < 50 ? (
                  <>
                    <li className="flex items-start gap-2"><span className="text-yellow-600 mt-1">⚠</span><span className="font-semibold">遺言書の作成を強くお勧めします</span></li>
                    <li className="flex items-start gap-2"><span className="text-yellow-600 mt-1">⚠</span><span>司法書士などの専門家への相談をご検討ください</span></li>
                    <li className="flex items-start gap-2"><span className="text-yellow-600 mt-1">⚠</span><span>生前に家族会議を開き、意思を明確にしておきましょう</span></li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2"><span className="text-red-600 mt-1">⚠</span><span className="font-bold">至急、専門家（司法書士・弁護士）への相談が必要です</span></li>
                    <li className="flex items-start gap-2"><span className="text-red-600 mt-1">⚠</span><span className="font-bold">公正証書遺言の作成を強く推奨します</span></li>
                    <li className="flex items-start gap-2"><span className="text-red-600 mt-1">⚠</span><span>家族信託や生前贈与などの対策も検討してください</span></li>
                    <li className="flex items-start gap-2"><span className="text-red-600 mt-1">⚠</span><span>早めの対策がトラブル予防の鍵となります</span></li>
                  </>
                )}
              </ul>
            </div>

            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded border border-gray-200">
              <p className="font-semibold mb-2">データについて</p>
              <p>本診断は262件の実際の相続事例を統計分析した結果に基づいています（p &lt; 0.001、統計学的に極めて有意）</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InheritanceTroublePredictor;